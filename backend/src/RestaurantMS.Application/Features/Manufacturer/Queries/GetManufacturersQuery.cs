using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Manufacturer.Queries;
public record GetManufacturersQuery() : IRequest<IEnumerable<object>>;
public class GetManufacturersQueryHandler : IRequestHandler<GetManufacturersQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetManufacturersQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetManufacturersQuery req, CancellationToken ct) {
        var items = await _uow.Manufacturers.GetAllAsync();
        return items;
    }
}