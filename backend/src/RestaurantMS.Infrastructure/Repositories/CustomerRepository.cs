using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class CustomerRepository : BaseRepository, ICustomerRepository
{
    public CustomerRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<Customer?> GetByIdAsync(long id) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Customers WHERE customer_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new Customer { CustomerId = r.GetInt64(0), FullName = r.GetString(1), Phone = r.GetString(2), Password = r.GetString(4) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<Customer>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Customers ORDER BY full_name";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Customer>();
            while (await r.ReadAsync()) list.Add(new Customer { CustomerId = r.GetInt64(0), FullName = r.GetString(1), Phone = r.GetString(2), Password = r.GetString(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Customer entity) {}
    public async Task UpdateAsync(Customer entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<Customer?> GetByPhoneAsync(string phone)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Customers WHERE phone = @Phone";
            cmd.Parameters.AddWithValue("@Phone", phone);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new Customer { CustomerId = r.GetInt64(0), FullName = r.GetString(1), Phone = r.GetString(2), Password = r.GetString(4) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task UpdateLoyaltyPointsAsync(long customerId, int points) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE Customers SET loyalty_points = loyalty_points + @Points WHERE customer_id = @Id";
            cmd.Parameters.AddWithValue("@Points", points);
            cmd.Parameters.AddWithValue("@Id", customerId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(Customer entity)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO Customers (phone, full_name, email, password, membership_level, loyalty_points, created_at)
                               OUTPUT INSERTED.customer_id VALUES (@Phone, @Name, @Email, @Pass, 'NORMAL', 0, GETUTCDATE())";
            cmd.Parameters.AddWithValue("@Phone", entity.Phone);
            cmd.Parameters.AddWithValue("@Name", entity.FullName);
            cmd.Parameters.AddWithValue("@Email", (object?)entity.Email ?? System.DBNull.Value);
            cmd.Parameters.AddWithValue("@Pass", entity.Password);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}