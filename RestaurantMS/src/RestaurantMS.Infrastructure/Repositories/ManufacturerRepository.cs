using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ManufacturerRepository : BaseRepository, IManufacturerRepository
{
    public ManufacturerRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<Manufacturer?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Manufacturers WHERE manufacturer_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new Manufacturer { ManufacturerId = (int)r.GetInt64(0), Name = r.GetString(1) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<Manufacturer>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Manufacturers ORDER BY name";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Manufacturer>();
            while (await r.ReadAsync()) list.Add(new Manufacturer { ManufacturerId = (int)r.GetInt64(0), Name = r.GetString(1) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Manufacturer entity) {}
    public async Task UpdateAsync(Manufacturer entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<long> InsertAndReturnIdAsync(Manufacturer entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "INSERT INTO Manufacturers (name, address, phone) OUTPUT INSERTED.manufacturer_id VALUES (@Name, @Addr, @Phone)";
            cmd.Parameters.AddWithValue("@Name", entity.Name);
            cmd.Parameters.AddWithValue("@Addr",  (object?)entity.Address ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Phone", (object?)entity.Phone   ?? DBNull.Value);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}