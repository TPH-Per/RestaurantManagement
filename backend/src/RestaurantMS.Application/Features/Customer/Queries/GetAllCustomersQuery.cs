using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Customer.Queries;
public record GetAllCustomersQuery() : IRequest<IEnumerable<object>>;
public class GetAllCustomersQueryHandler : IRequestHandler<GetAllCustomersQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllCustomersQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllCustomersQuery req, CancellationToken ct) {
        var items = await _uow.Customers.GetAllAsync();
        return items;
    }
}