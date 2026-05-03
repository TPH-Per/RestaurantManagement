using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class StaffRepository : BaseRepository, IStaffRepository
{
    public StaffRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<Staff?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Staff>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Staff ORDER BY full_name";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Staff>();
            while (await r.ReadAsync()) {
                list.Add(new Staff {
                    StaffId = r.GetInt64(r.GetOrdinal("staff_id")),
                    FullName = r.GetString(r.GetOrdinal("full_name")),
                    Email = r.GetString(r.GetOrdinal("email")),
                    Password = r.GetString(r.GetOrdinal("password")),
                    Role = r.GetString(r.GetOrdinal("role")),
                    IsActive = r.GetBoolean(r.GetOrdinal("is_active"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Staff entity) {}
    public async Task UpdateAsync(Staff entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<Staff?> GetByEmailAsync(string email)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Staff WHERE email = @Email";
            cmd.Parameters.AddWithValue("@Email", email);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new Staff {
                    StaffId = r.GetInt64(r.GetOrdinal("staff_id")),
                    FullName = r.GetString(r.GetOrdinal("full_name")),
                    Email = r.GetString(r.GetOrdinal("email")),
                    Password = r.GetString(r.GetOrdinal("password")),
                    Role = r.GetString(r.GetOrdinal("role")),
                    IsActive = r.GetBoolean(r.GetOrdinal("is_active"))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    
    public async Task<long> InsertAndReturnIdAsync(Staff entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO Staff (full_name, email, phone, password, role, is_active, created_at)
                               OUTPUT INSERTED.staff_id VALUES (@Name,@Email,@Phone,@Pass,@Role,1,GETUTCDATE())";
            cmd.Parameters.AddWithValue("@Name",  entity.FullName);
            cmd.Parameters.AddWithValue("@Email", entity.Email);
            cmd.Parameters.AddWithValue("@Phone", (object?)entity.Phone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Pass",  entity.Password);
            cmd.Parameters.AddWithValue("@Role",  entity.Role);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}