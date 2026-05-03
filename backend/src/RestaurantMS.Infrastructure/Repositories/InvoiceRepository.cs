using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class InvoiceRepository : BaseRepository, IInvoiceRepository
{
    public InvoiceRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<Invoice?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Invoices WHERE invoice_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new Invoice {
                    InvoiceId = r.GetInt64(r.GetOrdinal("invoice_id")),
                    OrderId = r.GetInt64(r.GetOrdinal("order_id")),
                    Subtotal = r.GetDecimal(r.GetOrdinal("subtotal")),
                    DiscountAmount = r.GetDecimal(r.GetOrdinal("discount_amount")),
                    Total = r.GetDecimal(r.GetOrdinal("total")),
                    Status = Enum.Parse<InvoiceStatus>(r.GetString(r.GetOrdinal("status")))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<Invoice>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Invoices ORDER BY invoice_id DESC";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Invoice>();
            while (await r.ReadAsync()) {
                list.Add(new Invoice {
                    InvoiceId = r.GetInt64(r.GetOrdinal("invoice_id")),
                    OrderId = r.GetInt64(r.GetOrdinal("order_id")),
                    Subtotal = r.GetDecimal(r.GetOrdinal("subtotal")),
                    DiscountAmount = r.GetDecimal(r.GetOrdinal("discount_amount")),
                    Total = r.GetDecimal(r.GetOrdinal("total")),
                    Status = Enum.Parse<InvoiceStatus>(r.GetString(r.GetOrdinal("status")))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Invoice entity) {}

    public async Task UpdateAsync(Invoice entity)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"UPDATE Invoices SET subtotal=@Sub, discount_amount=@Disc, total=@Total, 
                               status=@Status, payment_method=@PM, discount_code_id=@DCId, 
                               cashier_id=@CId, paid_at=@PaidAt WHERE invoice_id=@Id";
            cmd.Parameters.AddWithValue("@Sub", entity.Subtotal);
            cmd.Parameters.AddWithValue("@Disc", entity.DiscountAmount);
            cmd.Parameters.AddWithValue("@Total", entity.Total);
            cmd.Parameters.AddWithValue("@Status", entity.Status.ToString());
            cmd.Parameters.AddWithValue("@PM", (object?)entity.PaymentMethod?.ToString() ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DCId", (object?)entity.DiscountCodeId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@CId", (object?)entity.CashierId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PaidAt", (object?)entity.PaidAt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Id", entity.InvoiceId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task DeleteAsync(long id) {}
    public async Task<Invoice?> GetByOrderIdAsync(long orderId)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Invoices WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Id", orderId);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new Invoice {
                    InvoiceId = r.GetInt64(r.GetOrdinal("invoice_id")),
                    OrderId = r.GetInt64(r.GetOrdinal("order_id")),
                    Status = Enum.Parse<InvoiceStatus>(r.GetString(r.GetOrdinal("status")))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    
    public async Task<long> InsertAndReturnIdAsync(Invoice invoice)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO Invoices (order_id, subtotal, discount_amount, total, status)
                               OUTPUT INSERTED.invoice_id VALUES (@OId, @Sub, @Disc, @Total, @Status)";
            cmd.Parameters.AddWithValue("@OId", invoice.OrderId);
            cmd.Parameters.AddWithValue("@Sub", invoice.Subtotal);
            cmd.Parameters.AddWithValue("@Disc", invoice.DiscountAmount);
            cmd.Parameters.AddWithValue("@Total", invoice.Total);
            cmd.Parameters.AddWithValue("@Status", invoice.Status.ToString());
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}