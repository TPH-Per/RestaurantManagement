using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Order.Commands;

public record StartServingCommand(long OrderId) : IRequest<Unit>;

public class StartServingCommandHandler : IRequestHandler<StartServingCommand, Unit>
{
    private readonly IUnitOfWork _uow;
    public StartServingCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Unit> Handle(StartServingCommand cmd, CancellationToken ct)
    {
        var order = await _uow.Orders.GetByIdAsync(cmd.OrderId)
            ?? throw new NotFoundException("RestaurantOrder", cmd.OrderId);
        order.StartServing(); // PENDING -> SERVING
        await _uow.Orders.UpdateStatusAsync(cmd.OrderId, OrderStatus.SERVING);
        return Unit.Value;
    }
}