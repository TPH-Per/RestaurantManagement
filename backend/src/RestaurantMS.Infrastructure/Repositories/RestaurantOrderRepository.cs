using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class RestaurantOrderRepository : BaseRepository, IRestaurantOrderRepository
{
    public RestaurantOrderRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<RestaurantOrder?> GetByIdAsync(long id) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantOrders WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new RestaurantOrder { OrderId = r.GetInt64(0), TableId = (int)r.GetInt64(1), Status = Enum.Parse<OrderStatus>(r.GetString(3)), CreatedAt = r.GetDateTime(4) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<RestaurantOrder>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantOrders ORDER BY created_at DESC";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<RestaurantOrder>();
            while (await r.ReadAsync()) list.Add(new RestaurantOrder { OrderId = r.GetInt64(0), TableId = (int)r.GetInt64(1), Status = Enum.Parse<OrderStatus>(r.GetString(3)), CreatedAt = r.GetDateTime(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(RestaurantOrder entity) {}
    public async Task UpdateAsync(RestaurantOrder entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<RestaurantOrder?> GetWithItemsAsync(long orderId) { return null; }
    public async Task<IEnumerable<RestaurantOrder>> GetByTableAsync(long tableId) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantOrders WHERE table_id = @Id";
            cmd.Parameters.AddWithValue("@Id", tableId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<RestaurantOrder>();
            while (await r.ReadAsync()) list.Add(new RestaurantOrder { OrderId = r.GetInt64(0), TableId = (int)r.GetInt64(1), Status = Enum.Parse<OrderStatus>(r.GetString(3)), CreatedAt = r.GetDateTime(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(RestaurantOrder order) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO RestaurantOrders (table_id, reservation_id, customer_id, status, created_at) OUTPUT INSERTED.order_id VALUES (@TId, @ResId, @CId, @Status, @Created)";
            cmd.Parameters.AddWithValue("@TId", order.TableId);
            cmd.Parameters.AddWithValue("@ResId", (object?)order.ReservationId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@CId", (object?)order.CustomerId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", order.Status.ToString());
            cmd.Parameters.AddWithValue("@Created", order.CreatedAt);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task UpdateStatusAsync(long orderId, OrderStatus status) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE RestaurantOrders SET status = @Status WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Status", status.ToString());
            cmd.Parameters.AddWithValue("@Id", orderId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}