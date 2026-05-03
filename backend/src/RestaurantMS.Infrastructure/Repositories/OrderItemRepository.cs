using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class OrderItemRepository : BaseRepository, IOrderItemRepository
{
    public OrderItemRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<OrderItem?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<OrderItem>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM OrderItems";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<OrderItem>();
            while (await r.ReadAsync()) list.Add(new OrderItem { OrderItemId = r.GetInt64(0), OrderId = r.GetInt64(1), ItemId = (int)r.GetInt64(2), Quantity = r.GetInt32(3), UnitPrice = r.GetDecimal(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(OrderItem entity) {}
    public async Task UpdateAsync(OrderItem entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<OrderItem>> GetByOrderIdAsync(long orderId)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM OrderItems WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Id", orderId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<OrderItem>();
            while (await r.ReadAsync()) {
                list.Add(new OrderItem { OrderItemId = r.GetInt64(0), OrderId = r.GetInt64(1), ItemId = (int)r.GetInt64(2), Quantity = r.GetInt32(3), UnitPrice = r.GetDecimal(4) });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(OrderItem item)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO OrderItems (order_id, item_id, quantity, unit_price) OUTPUT INSERTED.order_item_id VALUES (@OId, @IId, @Qty, @Price)";
            cmd.Parameters.AddWithValue("@OId", item.OrderId);
            cmd.Parameters.AddWithValue("@IId", item.ItemId);
            cmd.Parameters.AddWithValue("@Qty", item.Quantity);
            cmd.Parameters.AddWithValue("@Price", item.UnitPrice);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}