using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class FBRepository : BaseRepository, IFBRepository
{
    public FBRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<FB?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM FBs WHERE fb_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new FB { 
                    ItemId = (int)r.GetInt64(0), 
                    Name = r.GetString(1), 
                    Price = r.GetDecimal(2), 
                    Type = Enum.Parse<FBType>(r.GetString(3)),
                    CategoryId = (int)r.GetInt64(r.GetOrdinal("category_id")),
                    IsVisible = r.GetBoolean(6),
                    Unit = r.IsDBNull(r.GetOrdinal("unit")) ? null : r.GetString(r.GetOrdinal("unit"))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<FB>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM FBs";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<FB>();
            while (await r.ReadAsync()) {
                list.Add(new FB { 
                    ItemId = (int)r.GetInt64(0), 
                    Name = r.GetString(1), 
                    Price = r.GetDecimal(2), 
                    Type = Enum.Parse<FBType>(r.GetString(3)),
                    CategoryId = (int)r.GetInt64(r.GetOrdinal("category_id")),
                    IsVisible = r.GetBoolean(6),
                    Unit = r.IsDBNull(r.GetOrdinal("unit")) ? null : r.GetString(r.GetOrdinal("unit"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(FB entity) {}
    public async Task UpdateAsync(FB entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<FB>> GetMenuAsync(bool includeInhouse = false) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = includeInhouse
                ? "SELECT * FROM FBs WHERE type != 'FRESH_RAW' AND is_visible = 1"
                : "SELECT * FROM FBs WHERE type = 'REGULAR' AND is_visible = 1";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<FB>();
            while (await r.ReadAsync()) {
                list.Add(new FB { 
                    ItemId = (int)r.GetInt64(0), 
                    Name = r.GetString(1), 
                    Price = r.GetDecimal(2), 
                    Type = Enum.Parse<FBType>(r.GetString(3)),
                    CategoryId = (int)r.GetInt64(r.GetOrdinal("category_id")),
                    IsVisible = r.GetBoolean(6),
                    Unit = r.IsDBNull(r.GetOrdinal("unit")) ? null : r.GetString(r.GetOrdinal("unit"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(FB entity) => 1;
}