using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Invoice.Commands.ApplyDiscount
{
    public record ApplyDiscountCommand(long InvoiceId, string DiscountCode) : IRequest<InvoiceDto>;
    public record InvoiceDto(long InvoiceId, long OrderId, decimal Subtotal, decimal DiscountAmount, decimal Total, string Status);

    public class ApplyDiscountCommandHandler : IRequestHandler<ApplyDiscountCommand, InvoiceDto>
    {
        private readonly IUnitOfWork _uow;
        public ApplyDiscountCommandHandler(IUnitOfWork uow) => _uow = uow;

        public async Task<InvoiceDto> Handle(ApplyDiscountCommand cmd, CancellationToken ct)
        {
            var invoice = await _uow.Invoices.GetByIdAsync(cmd.InvoiceId)
                ?? throw new NotFoundException(nameof(RestaurantMS.Domain.Entities.Invoice), cmd.InvoiceId);
            var code = await _uow.DiscountCodes.GetByCodeAsync(cmd.DiscountCode)
                ?? throw new NotFoundException("DiscountCode", cmd.DiscountCode);

            // All validation before any DB write
            if (!code.IsActive)          throw new DomainException("Discount code is not active.");
            if (code.ValidTo < DateTime.UtcNow) throw new DomainException("Discount code has expired.");
            if (code.UsageLimit > 0 && code.UsedCount >= code.UsageLimit)
                throw new DomainException("Discount code usage limit reached.");
            if (invoice.Subtotal < code.MinOrderAmount)
                throw new DomainException($"Minimum order for this code is {code.MinOrderAmount:N0}.");

            var discountAmt = code.DiscountType == "PERCENT" // Adjust to enum if needed
                ? invoice.Subtotal * code.DiscountValue / 100m : code.DiscountValue;
            if (code.MaxDiscountAmount > 0)
                discountAmt = Math.Min(discountAmt, code.MaxDiscountAmount.Value);

            invoice.ApplyDiscount(discountAmt);
            invoice.DiscountCodeId = code.DiscountCodeId;

            await _uow.BeginTransactionAsync(ct);
            try
            {
                await _uow.Invoices.UpdateAsync(invoice);
                await _uow.DiscountCodes.IncrementUsedCountAsync(code.DiscountCodeId); // atomic
                await _uow.CommitAsync(ct);
            }
            catch { await _uow.RollbackAsync(ct); throw; }

            return new InvoiceDto(invoice.InvoiceId, invoice.OrderId,
                invoice.Subtotal, invoice.DiscountAmount, invoice.Total, invoice.Status.ToString());
        }
    }
}