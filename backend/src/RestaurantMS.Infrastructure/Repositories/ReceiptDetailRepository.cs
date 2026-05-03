using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReceiptDetailRepository : BaseRepository, IReceiptDetailRepository
{
    public ReceiptDetailRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<ReceiptDetail?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<ReceiptDetail>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM ReceiptDetails";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<ReceiptDetail>();
            while (await r.ReadAsync()) list.Add(new ReceiptDetail { ReceiptDetailId = r.GetInt64(0), ReceiptId = r.GetInt64(1), ItemId = (int)r.GetInt64(2), Quantity = r.GetInt32(3), ImportPrice = r.GetDecimal(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(ReceiptDetail entity) {}
    public async Task UpdateAsync(ReceiptDetail entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<long> InsertAndReturnIdAsync(ReceiptDetail entity)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO ReceiptDetails (receipt_id, item_id, quantity, import_price) OUTPUT INSERTED.receipt_detail_id VALUES (@RId, @IId, @Qty, @Price)";
            cmd.Parameters.AddWithValue("@RId", entity.ReceiptId);
            cmd.Parameters.AddWithValue("@IId", entity.ItemId);
            cmd.Parameters.AddWithValue("@Qty", entity.Quantity);
            cmd.Parameters.AddWithValue("@Price", entity.ImportPrice);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<ReceiptDetail>> GetByReceiptIdAsync(long receiptId) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM ReceiptDetails WHERE receipt_id = @Id";
            cmd.Parameters.AddWithValue("@Id", receiptId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<ReceiptDetail>();
            while (await r.ReadAsync()) list.Add(new ReceiptDetail { ReceiptDetailId = r.GetInt64(0), ReceiptId = r.GetInt64(1), ItemId = (int)r.GetInt64(2), Quantity = r.GetInt32(3), ImportPrice = r.GetDecimal(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task DeleteByReceiptIdAsync(long receiptId) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "DELETE FROM ReceiptDetails WHERE receipt_id = @Id";
            cmd.Parameters.AddWithValue("@Id", receiptId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}