using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Features.Order.Commands;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Order.Queries;

public record GetAllOrdersQuery() : IRequest<IEnumerable<OrderDto>>;

public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, IEnumerable<OrderDto>>
{
    private readonly IUnitOfWork _uow;
    public GetAllOrdersQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<OrderDto>> Handle(GetAllOrdersQuery req, CancellationToken ct)
    {
        var orders = await _uow.Orders.GetAllAsync();
        return orders.Select(o => new OrderDto(o.OrderId, o.TableId, o.Status.ToString(), o.CreatedAt));
    }
}