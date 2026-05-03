using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Order.Commands.AddOrderItem
{
    public record AddOrderItemCommand(long OrderId, long FBId, int Quantity) : IRequest<OrderItemDto>;
    public record OrderItemDto(long OrderItemId, string FBName, int Quantity, decimal UnitPrice);

    public class AddOrderItemCommandHandler : IRequestHandler<AddOrderItemCommand, OrderItemDto>
    {
        private readonly IUnitOfWork _uow;
        public AddOrderItemCommandHandler(IUnitOfWork uow) => _uow = uow;

        public async Task<OrderItemDto> Handle(AddOrderItemCommand cmd, CancellationToken ct)
        {
            // 1. Load — throw NotFoundException if missing
            var order = await _uow.Orders.GetByIdAsync(cmd.OrderId)
                ?? throw new NotFoundException(nameof(RestaurantOrder), cmd.OrderId);
            var fb = await _uow.FBs.GetByIdAsync(cmd.FBId)
                ?? throw new NotFoundException(nameof(FB), cmd.FBId);
            var warehouse = await _uow.Warehouses.GetByFBIdAsync(cmd.FBId)
                ?? throw new NotFoundException(nameof(Warehouse), cmd.FBId);

            // 2. Domain invariants (throw typed domain exceptions)
            if (!fb.IsSellable())              // FRESH_RAW check lives in FB.IsSellable()
                throw new FreshRawCannotBeSoldException(fb.Name);
            if (!order.CanAddItem())
                throw new DomainException($"Cannot add items to a '{order.Status}' order.");

            // 3. Deduct stock — REGULAR: throws StockCannotGoNegativeException if qty < 0
            warehouse.DeductStock(cmd.Quantity, fb.Name);

            // 4. Create OrderItem
            var item = new OrderItem { OrderId = cmd.OrderId, ItemId = (int)cmd.FBId,
                Quantity = cmd.Quantity, UnitPrice = fb.Price };

            // 5. Persist atomically — SINGLE transaction
            await _uow.BeginTransactionAsync(ct);
            try
            {
                item.OrderItemId = await _uow.OrderItems.InsertAndReturnIdAsync(item);
                await _uow.Warehouses.UpdateQuantityAsync(fb.ItemId, warehouse.Quantity);
                await _uow.CommitAsync(ct);
            }
            catch { await _uow.RollbackAsync(ct); throw; }

            // 6. Return DTO — NEVER the entity
            return new OrderItemDto(item.OrderItemId, fb.Name, item.Quantity, item.UnitPrice);
        }
    }
}