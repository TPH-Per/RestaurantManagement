using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Invoice.Commands.CreateInvoice
{
    public record CreateInvoiceCommand(long OrderId) : IRequest<InvoiceDto>;
    public record InvoiceDto(long InvoiceId, long OrderId, decimal Subtotal, decimal DiscountAmount, decimal Total, string Status);

    public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, InvoiceDto>
    {
        private readonly IUnitOfWork _uow;
        public CreateInvoiceCommandHandler(IUnitOfWork uow) => _uow = uow;

        public async Task<InvoiceDto> Handle(CreateInvoiceCommand cmd, CancellationToken ct)
        {
            var order = await _uow.Orders.GetWithItemsAsync(cmd.OrderId)
                ?? throw new NotFoundException(nameof(RestaurantOrder), cmd.OrderId);

            // Enforce 1 invoice per order
            var existing = await _uow.Invoices.GetByOrderIdAsync(cmd.OrderId);
            if (existing != null)
                throw new DomainException($"Order {cmd.OrderId} already has an invoice.");

            var subtotal = order.OrderItems.Sum(i => i.Quantity * i.UnitPrice);

            // Domain factory — throws InvoiceRequiresCompletedOrderException if not COMPLETED
            var invoice = RestaurantMS.Domain.Entities.Invoice.Create(order, subtotal);

            await _uow.BeginTransactionAsync(ct);
            try
            {
                invoice.InvoiceId = await _uow.Invoices.InsertAndReturnIdAsync(invoice);
                await _uow.CommitAsync(ct);
            }
            catch { await _uow.RollbackAsync(ct); throw; }

            return new InvoiceDto(invoice.InvoiceId, invoice.OrderId,
                invoice.Subtotal, 0, invoice.Subtotal, "UNPAID");
        }
    }
}