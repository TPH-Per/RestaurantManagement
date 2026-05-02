using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Order.Commands.CancelOrder
{
    public record CancelOrderCommand(long OrderId) : IRequest<Unit>;

    public class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand, Unit>
    {
        private readonly IUnitOfWork _uow;
        public CancelOrderCommandHandler(IUnitOfWork uow) => _uow = uow;

        public async Task<Unit> Handle(CancelOrderCommand cmd, CancellationToken ct)
        {
            var order = await _uow.Orders.GetByIdAsync(cmd.OrderId)
                ?? throw new NotFoundException(nameof(RestaurantOrder), cmd.OrderId);

            order.Cancel(); // throws DomainException if status == COMPLETED

            var items = await _uow.OrderItems.GetByOrderIdAsync(cmd.OrderId);

            await _uow.BeginTransactionAsync(ct);
            try
            {
                foreach (var item in items)
                {
                    var wh = await _uow.Warehouses.GetByFBIdAsync(item.ItemId);
                    if (wh != null)
                    {
                        wh.RestoreStock(item.Quantity);
                        await _uow.Warehouses.UpdateQuantityAsync(item.ItemId, wh.Quantity);
                    }
                }
                await _uow.Orders.UpdateStatusAsync(cmd.OrderId, OrderStatus.CANCELLED);
                await _uow.CommitAsync(ct);
            }
            catch { await _uow.RollbackAsync(ct); throw; }

            return Unit.Value;
        }
    }
}