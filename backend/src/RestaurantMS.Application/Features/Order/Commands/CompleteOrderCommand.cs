using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Order.Commands;

public record CompleteOrderCommand(long OrderId) : IRequest<Unit>;

public class CompleteOrderCommandHandler : IRequestHandler<CompleteOrderCommand, Unit>
{
    private readonly IUnitOfWork _uow;
    public CompleteOrderCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Unit> Handle(CompleteOrderCommand req, CancellationToken ct)
    {
        var order = await _uow.Orders.GetByIdAsync(req.OrderId) ?? throw new NotFoundException("Order", req.OrderId);
        order.Complete(); // will throw if not SERVING or appropriate state
        await _uow.Orders.UpdateStatusAsync(req.OrderId, Domain.Enums.OrderStatus.COMPLETED);
        return Unit.Value;
    }
}