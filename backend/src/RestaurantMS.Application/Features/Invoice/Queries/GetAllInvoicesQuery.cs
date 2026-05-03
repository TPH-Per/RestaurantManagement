using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Features.Invoice.Commands.ApplyDiscount;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Invoice.Queries;

public record GetAllInvoicesQuery() : IRequest<IEnumerable<InvoiceDto>>;

public class GetAllInvoicesQueryHandler : IRequestHandler<GetAllInvoicesQuery, IEnumerable<InvoiceDto>>
{
    private readonly IUnitOfWork _uow;
    public GetAllInvoicesQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<InvoiceDto>> Handle(GetAllInvoicesQuery req, CancellationToken ct)
    {
        var invoices = await _uow.Invoices.GetAllAsync();
        return invoices.Select(i => new InvoiceDto(i.InvoiceId, i.OrderId, i.Subtotal, i.DiscountAmount, i.Total, i.Status.ToString()));
    }
}