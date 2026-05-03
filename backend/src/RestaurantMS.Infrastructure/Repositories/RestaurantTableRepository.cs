using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class RestaurantTableRepository : BaseRepository, IRestaurantTableRepository
{
    public RestaurantTableRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<RestaurantTable?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantTables WHERE table_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (!await r.ReadAsync()) return null;
            return new RestaurantTable {
                TableId = (int)r.GetInt64(r.GetOrdinal("table_id")),
                Status = Enum.Parse<TableStatus>(r.GetString(r.GetOrdinal("status"))),
                Capacity = r.GetInt32(r.GetOrdinal("capacity"))
            };
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<RestaurantTable>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantTables ORDER BY table_id";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<RestaurantTable>();
            while (await r.ReadAsync()) {
                list.Add(new RestaurantTable {
                    TableId = (int)r.GetInt64(r.GetOrdinal("table_id")),
                    Status = Enum.Parse<TableStatus>(r.GetString(r.GetOrdinal("status"))),
                    Capacity = r.GetInt32(r.GetOrdinal("capacity"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(RestaurantTable entity) {}
    public async Task UpdateAsync(RestaurantTable entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE RestaurantTables SET status = @Status WHERE table_id = @Id";
            cmd.Parameters.AddWithValue("@Status", entity.Status.ToString());
            cmd.Parameters.AddWithValue("@Id", entity.TableId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task DeleteAsync(long id) {}
}