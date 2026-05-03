using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReviewRepository : BaseRepository, IReviewRepository
{
    public ReviewRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<Review?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Review>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Reviews";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Review>();
            while (await r.ReadAsync()) list.Add(new Review { ReviewId = r.GetInt64(0), InvoiceId = r.GetInt64(1), CustomerId = r.GetInt64(2), Stars = r.GetInt32(3), Content = r.GetString(4), CreatedAt = r.GetDateTime(5) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Review entity) {}
    public async Task UpdateAsync(Review entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<bool> ExistsByInvoiceIdAsync(long invoiceId)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT COUNT(1) FROM Reviews WHERE invoice_id = @Id";
            cmd.Parameters.AddWithValue("@Id", invoiceId);
            return (int)await cmd.ExecuteScalarAsync() > 0;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(Review review)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO Reviews (invoice_id, customer_id, stars, content, created_at) OUTPUT INSERTED.review_id VALUES (@IId, @CId, @Stars, @Content, @Created)";
            cmd.Parameters.AddWithValue("@IId", review.InvoiceId);
            cmd.Parameters.AddWithValue("@CId", review.CustomerId);
            cmd.Parameters.AddWithValue("@Stars", review.Stars);
            cmd.Parameters.AddWithValue("@Content", review.Content);
            cmd.Parameters.AddWithValue("@Created", review.CreatedAt);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}