using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class DiscountCodeRepository : BaseRepository, IDiscountCodeRepository
{
    public DiscountCodeRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<DiscountCode?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<DiscountCode>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM DiscountCodes";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<DiscountCode>();
            while (await r.ReadAsync()) {
                list.Add(new DiscountCode {
                    DiscountCodeId = (int)r.GetInt64(r.GetOrdinal("discount_code_id")),
                    Code = r.GetString(r.GetOrdinal("code")),
                    DiscountType = r.GetString(r.GetOrdinal("discount_type")),
                    DiscountValue = r.GetDecimal(r.GetOrdinal("discount_value")),
                    MinOrderAmount = r.IsDBNull(r.GetOrdinal("min_order_amount")) ? null : r.GetDecimal(r.GetOrdinal("min_order_amount")),
                    MaxDiscountAmount = r.IsDBNull(r.GetOrdinal("max_discount_amount")) ? null : r.GetDecimal(r.GetOrdinal("max_discount_amount")),
                    ValidFrom = r.GetDateTime(r.GetOrdinal("valid_from")),
                    ValidTo = r.GetDateTime(r.GetOrdinal("valid_to")),
                    UsageLimit = r.IsDBNull(r.GetOrdinal("usage_limit")) ? null : r.GetInt32(r.GetOrdinal("usage_limit")),
                    UsedCount = r.GetInt32(r.GetOrdinal("used_count")),
                    IsActive = r.GetBoolean(r.GetOrdinal("is_active"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(DiscountCode entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO DiscountCodes (code, discount_type, discount_value, min_order_amount,
                max_discount_amount, valid_from, valid_to, usage_limit, used_count, is_active)
            VALUES (@Code,@Type,@Val,@Min,@Max,@From,@To,@Limit,0,1)";
            cmd.Parameters.AddWithValue("@Code",  entity.Code);
            cmd.Parameters.AddWithValue("@Type",  entity.DiscountType);
            cmd.Parameters.AddWithValue("@Val",   entity.DiscountValue);
            cmd.Parameters.AddWithValue("@Min",   (object?)entity.MinOrderAmount    ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Max",   (object?)entity.MaxDiscountAmount ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@From",  entity.ValidFrom);
            cmd.Parameters.AddWithValue("@To",    entity.ValidTo);
            cmd.Parameters.AddWithValue("@Limit", (object?)entity.UsageLimit        ?? DBNull.Value);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task UpdateAsync(DiscountCode entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE DiscountCodes SET is_active = @Active WHERE discount_code_id = @Id";
            cmd.Parameters.AddWithValue("@Active", entity.IsActive);
            cmd.Parameters.AddWithValue("@Id",     entity.DiscountCodeId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task DeleteAsync(long id) {}
    
    public async Task<DiscountCode?> GetByCodeAsync(string code)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM DiscountCodes WHERE code = @Code";
            cmd.Parameters.AddWithValue("@Code", code);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new DiscountCode {
                    DiscountCodeId = (int)r.GetInt64(r.GetOrdinal("discount_code_id")),
                    Code = r.GetString(r.GetOrdinal("code")),
                    DiscountType = r.GetString(r.GetOrdinal("discount_type")),
                    DiscountValue = r.GetDecimal(r.GetOrdinal("discount_value")),
                    MinOrderAmount = r.IsDBNull(r.GetOrdinal("min_order_amount")) ? null : r.GetDecimal(r.GetOrdinal("min_order_amount")),
                    MaxDiscountAmount = r.IsDBNull(r.GetOrdinal("max_discount_amount")) ? null : r.GetDecimal(r.GetOrdinal("max_discount_amount")),
                    ValidFrom = r.GetDateTime(r.GetOrdinal("valid_from")),
                    ValidTo = r.GetDateTime(r.GetOrdinal("valid_to")),
                    UsageLimit = r.IsDBNull(r.GetOrdinal("usage_limit")) ? null : r.GetInt32(r.GetOrdinal("usage_limit")),
                    UsedCount = r.GetInt32(r.GetOrdinal("used_count")),
                    IsActive = r.GetBoolean(r.GetOrdinal("is_active"))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task IncrementUsedCountAsync(long discountCodeId)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE DiscountCodes SET used_count = used_count + 1 WHERE discount_code_id = @Id";
            cmd.Parameters.AddWithValue("@Id", discountCodeId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}