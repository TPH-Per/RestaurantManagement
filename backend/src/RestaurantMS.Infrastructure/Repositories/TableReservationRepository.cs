using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class TableReservationRepository : BaseRepository, ITableReservationRepository
{
    public TableReservationRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<TableReservation?> GetByIdAsync(long id) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM TableReservations WHERE reservation_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new TableReservation { ReservationId = r.GetInt64(0), CustomerId = r.GetInt64(1), TableId = (int)r.GetInt64(2), ReservedAt = r.GetDateTime(3), GuestCount = r.GetInt32(4), Status = Enum.Parse<ReservationStatus>(r.GetString(6)) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<TableReservation>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM TableReservations ORDER BY reserved_at DESC";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<TableReservation>();
            while (await r.ReadAsync()) list.Add(new TableReservation { ReservationId = r.GetInt64(0), CustomerId = r.GetInt64(1), TableId = (int)r.GetInt64(2), ReservedAt = r.GetDateTime(3), GuestCount = r.GetInt32(4), Status = Enum.Parse<ReservationStatus>(r.GetString(6)) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(TableReservation entity) {}
    public async Task UpdateAsync(TableReservation entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<TableReservation>> GetByCustomerIdAsync(long customerId) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM TableReservations WHERE customer_id = @Id";
            cmd.Parameters.AddWithValue("@Id", customerId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<TableReservation>();
            while (await r.ReadAsync()) list.Add(new TableReservation { ReservationId = r.GetInt64(0), CustomerId = r.GetInt64(1), TableId = (int)r.GetInt64(2), ReservedAt = r.GetDateTime(3), GuestCount = r.GetInt32(4), Status = Enum.Parse<ReservationStatus>(r.GetString(6)) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(TableReservation res) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO TableReservations (customer_id, table_id, reserved_at, guest_count, notes, status) OUTPUT INSERTED.reservation_id VALUES (@CId, @TId, @Date, @GC, @Notes, @Status)";
            cmd.Parameters.AddWithValue("@CId", res.CustomerId); cmd.Parameters.AddWithValue("@TId", res.TableId); cmd.Parameters.AddWithValue("@Date", res.ReservedAt); cmd.Parameters.AddWithValue("@GC", res.GuestCount); cmd.Parameters.AddWithValue("@Notes", (object?)res.Notes ?? DBNull.Value); cmd.Parameters.AddWithValue("@Status", res.Status.ToString());
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task UpdateStatusAsync(long resId, ReservationStatus status) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE TableReservations SET status = @Status WHERE reservation_id = @Id";
            cmd.Parameters.AddWithValue("@Status", status.ToString()); cmd.Parameters.AddWithValue("@Id", resId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}