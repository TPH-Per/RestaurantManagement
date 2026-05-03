using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReviewReplyRepository : BaseRepository, IReviewReplyRepository
{
    public ReviewReplyRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<ReviewReply?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM ReviewReplies WHERE reply_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            return await r.ReadAsync() ? MapReply(r) : null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task<IEnumerable<ReviewReply>> GetAllAsync()
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM ReviewReplies";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<ReviewReply>();
            while (await r.ReadAsync()) list.Add(MapReply(r));
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task AddAsync(ReviewReply entity) => await InsertAndReturnIdAsync(entity);

    public async Task UpdateAsync(ReviewReply entity)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE ReviewReplies SET content=@Content WHERE reply_id=@Id";
            cmd.Parameters.AddWithValue("@Content", entity.Content);
            cmd.Parameters.AddWithValue("@Id", entity.ReplyId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task DeleteAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "DELETE FROM ReviewReplies WHERE reply_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task<long> InsertAndReturnIdAsync(ReviewReply reply)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO ReviewReplies (review_id, staff_id, content, created_at)
                               OUTPUT INSERTED.reply_id VALUES (@RId, @SId, @Content, @Created)";
            cmd.Parameters.AddWithValue("@RId", reply.ReviewId);
            cmd.Parameters.AddWithValue("@SId", reply.StaffId);
            cmd.Parameters.AddWithValue("@Content", reply.Content);
            cmd.Parameters.AddWithValue("@Created", reply.CreatedAt);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task<IEnumerable<ReviewReply>> GetByReviewIdAsync(long reviewId)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM ReviewReplies WHERE review_id = @Id";
            cmd.Parameters.AddWithValue("@Id", reviewId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<ReviewReply>();
            while (await r.ReadAsync()) list.Add(MapReply(r));
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    private ReviewReply MapReply(SqlDataReader r) => new()
    {
        ReplyId = r.GetInt64(r.GetOrdinal("reply_id")),
        ReviewId = r.GetInt64(r.GetOrdinal("review_id")),
        StaffId = r.GetInt64(r.GetOrdinal("staff_id")),
        Content = r.GetString(r.GetOrdinal("content")),
        CreatedAt = r.GetDateTime(r.GetOrdinal("created_at"))
    };
}
