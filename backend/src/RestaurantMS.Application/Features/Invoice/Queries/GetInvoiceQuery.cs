using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Features.Invoice.Commands.ApplyDiscount;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Invoice.Queries;

public record GetInvoiceQuery(long InvoiceId) : IRequest<InvoiceDto>;

public class GetInvoiceQueryHandler : IRequestHandler<GetInvoiceQuery, InvoiceDto>
{
    private readonly IUnitOfWork _uow;
    public GetInvoiceQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<InvoiceDto> Handle(GetInvoiceQuery req, CancellationToken ct)
    {
        var invoice = await _uow.Invoices.GetByIdAsync(req.InvoiceId)
            ?? throw new NotFoundException("Invoice", req.InvoiceId);
        return new InvoiceDto(invoice.InvoiceId, invoice.OrderId, invoice.Subtotal, invoice.DiscountAmount, invoice.Total, invoice.Status.ToString());
    }
}