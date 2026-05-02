using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Receipt.Queries;
public record GetAllReceiptsQuery() : IRequest<IEnumerable<object>>;
public class GetAllReceiptsQueryHandler : IRequestHandler<GetAllReceiptsQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllReceiptsQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllReceiptsQuery req, CancellationToken ct) {
        var items = await _uow.Receipts.GetAllAsync();
        return items;
    }
}