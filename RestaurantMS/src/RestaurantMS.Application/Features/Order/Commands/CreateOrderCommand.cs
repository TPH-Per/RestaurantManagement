using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Order.Commands;

public record CreateOrderCommand(long TableId, long? ReservationId, long? CustomerId) : IRequest<OrderDto>;
public record OrderDto(long OrderId, long TableId, string Status, DateTime CreatedAt);

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    private readonly IUnitOfWork _uow;
    public CreateOrderCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<OrderDto> Handle(CreateOrderCommand req, CancellationToken ct)
    {
        var order = new RestaurantOrder {
            TableId = (int)req.TableId,
            ReservationId = req.ReservationId,
            CustomerId = req.CustomerId,
            Status = Domain.Enums.OrderStatus.PENDING,
            CreatedAt = DateTime.UtcNow
        };
        var id = await _uow.Orders.InsertAndReturnIdAsync(order);
        return new OrderDto(id, req.TableId, "PENDING", order.CreatedAt);
    }
}