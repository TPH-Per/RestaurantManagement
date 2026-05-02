using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Features.Order.Commands;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Order.Queries;

public record GetOrderQuery(long OrderId) : IRequest<OrderDto>;

public class GetOrderQueryHandler : IRequestHandler<GetOrderQuery, OrderDto>
{
    private readonly IUnitOfWork _uow;
    public GetOrderQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<OrderDto> Handle(GetOrderQuery req, CancellationToken ct)
    {
        var order = await _uow.Orders.GetByIdAsync(req.OrderId) ?? throw new NotFoundException("Order", req.OrderId);
        return new OrderDto(order.OrderId, order.TableId, order.Status.ToString(), order.CreatedAt);
    }
}