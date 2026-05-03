using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReceiptRepository : BaseRepository, IReceiptRepository
{
    public ReceiptRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<Receipt?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Receipt>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Receipts";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Receipt>();
            while (await r.ReadAsync()) list.Add(new Receipt { ReceiptId = r.GetInt64(0), ManufacturerId = r.GetInt64(1), CreatedBy = r.GetInt64(2), ReceiptDate = r.GetDateTime(3) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Receipt entity) {}
    public async Task UpdateAsync(Receipt entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<Receipt?> GetWithDetailsAsync(long receiptId) { return null; }
    public async Task<long> InsertAndReturnIdAsync(Receipt receipt)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO Receipts (manufacturer_id, staff_id, imported_at) OUTPUT INSERTED.receipt_id VALUES (@MId, @SId, @Date)";
            cmd.Parameters.AddWithValue("@MId", receipt.ManufacturerId);
            cmd.Parameters.AddWithValue("@SId", receipt.CreatedBy);
            cmd.Parameters.AddWithValue("@Date", receipt.ReceiptDate);
            return Convert.ToInt64(await cmd.ExecuteScalarAsync());
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}