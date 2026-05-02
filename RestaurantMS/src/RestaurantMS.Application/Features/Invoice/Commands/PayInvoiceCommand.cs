using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Features.Invoice.Commands.ApplyDiscount;
using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Invoice.Commands;

public record PayInvoiceCommand(long InvoiceId, string Method, long CashierId) : IRequest<InvoiceDto>;

public class PayInvoiceCommandHandler : IRequestHandler<PayInvoiceCommand, InvoiceDto>
{
    private readonly IUnitOfWork _uow;
    public PayInvoiceCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<InvoiceDto> Handle(PayInvoiceCommand cmd, CancellationToken ct)
    {
        var invoice = await _uow.Invoices.GetByIdAsync(cmd.InvoiceId)
            ?? throw new NotFoundException("Invoice", cmd.InvoiceId);

        var method = Enum.Parse<PaymentMethod>(cmd.Method, ignoreCase: true);
        invoice.MarkPaid(method, cmd.CashierId);
        await _uow.Invoices.UpdateAsync(invoice);

        return new InvoiceDto(invoice.InvoiceId, invoice.OrderId,
            invoice.Subtotal, invoice.DiscountAmount, invoice.Total,
            invoice.Status.ToString());
    }
}