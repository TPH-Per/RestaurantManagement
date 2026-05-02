using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class CategoryRepository : BaseRepository, ICategoryRepository
{
    public CategoryRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<Category?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Categories WHERE category_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new Category { CategoryId = (int)r.GetInt64(0), Name = r.GetString(1), Type = r.GetString(2) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<Category>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Categories ORDER BY name";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Category>();
            while (await r.ReadAsync()) list.Add(new Category { CategoryId = (int)r.GetInt64(0), Name = r.GetString(1), Type = r.GetString(2) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Category entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "INSERT INTO Categories (name, type) VALUES (@Name, @Type)";
            cmd.Parameters.AddWithValue("@Name", entity.Name);
            cmd.Parameters.AddWithValue("@Type", entity.Type ?? "FOOD");
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task UpdateAsync(Category entity) {}
    public async Task DeleteAsync(long id) {}
}