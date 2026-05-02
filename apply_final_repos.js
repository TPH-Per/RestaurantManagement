const fs = require('fs');
const path = require('path');

const dir = 'RestaurantMS/src/RestaurantMS.Infrastructure/Repositories';

const repos = {
    'CustomerRepository.cs': `
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
`,
    'OrderItemRepository.cs': `
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class OrderItemRepository : BaseRepository, IOrderItemRepository
{
    public OrderItemRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<OrderItem?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<OrderItem>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM OrderItems";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<OrderItem>();
            while (await r.ReadAsync()) list.Add(new OrderItem { OrderItemId = r.GetInt64(0), OrderId = r.GetInt64(1), ItemId = (int)r.GetInt64(2), Quantity = r.GetInt32(3), UnitPrice = r.GetDecimal(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(OrderItem entity) {}
    public async Task UpdateAsync(OrderItem entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<OrderItem>> GetByOrderIdAsync(long orderId)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM OrderItems WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Id", orderId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<OrderItem>();
            while (await r.ReadAsync()) {
                list.Add(new OrderItem { OrderItemId = r.GetInt64(0), OrderId = r.GetInt64(1), ItemId = (int)r.GetInt64(2), Quantity = r.GetInt32(3), UnitPrice = r.GetDecimal(4) });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(OrderItem item)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO OrderItems (order_id, item_id, quantity, unit_price) OUTPUT INSERTED.order_item_id VALUES (@OId, @IId, @Qty, @Price)";
            cmd.Parameters.AddWithValue("@OId", item.OrderId);
            cmd.Parameters.AddWithValue("@IId", item.ItemId);
            cmd.Parameters.AddWithValue("@Qty", item.Quantity);
            cmd.Parameters.AddWithValue("@Price", item.UnitPrice);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}
`,
    'ReceiptRepository.cs': `
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
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}
`,
    'ReceiptDetailRepository.cs': `
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
`,
    'ReviewRepository.cs': `
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
`,
    'RestaurantOrderRepository.cs': `
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class RestaurantOrderRepository : BaseRepository, IRestaurantOrderRepository
{
    public RestaurantOrderRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<RestaurantOrder?> GetByIdAsync(long id) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantOrders WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new RestaurantOrder { OrderId = r.GetInt64(0), TableId = (int)r.GetInt64(1), Status = Enum.Parse<OrderStatus>(r.GetString(3)), CreatedAt = r.GetDateTime(4) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<RestaurantOrder>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantOrders ORDER BY created_at DESC";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<RestaurantOrder>();
            while (await r.ReadAsync()) list.Add(new RestaurantOrder { OrderId = r.GetInt64(0), TableId = (int)r.GetInt64(1), Status = Enum.Parse<OrderStatus>(r.GetString(3)), CreatedAt = r.GetDateTime(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(RestaurantOrder entity) {}
    public async Task UpdateAsync(RestaurantOrder entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<RestaurantOrder?> GetWithItemsAsync(long orderId) { return null; }
    public async Task<IEnumerable<RestaurantOrder>> GetByTableAsync(long tableId) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantOrders WHERE table_id = @Id";
            cmd.Parameters.AddWithValue("@Id", tableId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<RestaurantOrder>();
            while (await r.ReadAsync()) list.Add(new RestaurantOrder { OrderId = r.GetInt64(0), TableId = (int)r.GetInt64(1), Status = Enum.Parse<OrderStatus>(r.GetString(3)), CreatedAt = r.GetDateTime(4) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(RestaurantOrder order) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO RestaurantOrders (table_id, reservation_id, customer_id, status, created_at) OUTPUT INSERTED.order_id VALUES (@TId, @ResId, @CId, @Status, @Created)";
            cmd.Parameters.AddWithValue("@TId", order.TableId);
            cmd.Parameters.AddWithValue("@ResId", (object?)order.ReservationId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@CId", (object?)order.CustomerId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", order.Status.ToString());
            cmd.Parameters.AddWithValue("@Created", order.CreatedAt);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task UpdateStatusAsync(long orderId, OrderStatus status) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE RestaurantOrders SET status = @Status WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Status", status.ToString());
            cmd.Parameters.AddWithValue("@Id", orderId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}
`,
    'TableReservationRepository.cs': `
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class TableReservationRepository : BaseRepository, ITableReservationRepository
{
    public TableReservationRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<TableReservation?> GetByIdAsync(long id) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM TableReservations WHERE reservation_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new TableReservation { ReservationId = r.GetInt64(0), CustomerId = r.GetInt64(1), TableId = (int)r.GetInt64(2), ReservedAt = r.GetDateTime(3), GuestCount = r.GetInt32(4), Status = Enum.Parse<ReservationStatus>(r.GetString(6)) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<TableReservation>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM TableReservations ORDER BY reserved_at DESC";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<TableReservation>();
            while (await r.ReadAsync()) list.Add(new TableReservation { ReservationId = r.GetInt64(0), CustomerId = r.GetInt64(1), TableId = (int)r.GetInt64(2), ReservedAt = r.GetDateTime(3), GuestCount = r.GetInt32(4), Status = Enum.Parse<ReservationStatus>(r.GetString(6)) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(TableReservation entity) {}
    public async Task UpdateAsync(TableReservation entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<TableReservation>> GetByCustomerIdAsync(long customerId) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM TableReservations WHERE customer_id = @Id";
            cmd.Parameters.AddWithValue("@Id", customerId);
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<TableReservation>();
            while (await r.ReadAsync()) list.Add(new TableReservation { ReservationId = r.GetInt64(0), CustomerId = r.GetInt64(1), TableId = (int)r.GetInt64(2), ReservedAt = r.GetDateTime(3), GuestCount = r.GetInt32(4), Status = Enum.Parse<ReservationStatus>(r.GetString(6)) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(TableReservation res) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO TableReservations (customer_id, table_id, reserved_at, guest_count, notes, status) OUTPUT INSERTED.reservation_id VALUES (@CId, @TId, @Date, @GC, @Notes, @Status)";
            cmd.Parameters.AddWithValue("@CId", res.CustomerId); cmd.Parameters.AddWithValue("@TId", res.TableId); cmd.Parameters.AddWithValue("@Date", res.ReservedAt); cmd.Parameters.AddWithValue("@GC", res.GuestCount); cmd.Parameters.AddWithValue("@Notes", (object?)res.Notes ?? DBNull.Value); cmd.Parameters.AddWithValue("@Status", res.Status.ToString());
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task UpdateStatusAsync(long resId, ReservationStatus status) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE TableReservations SET status = @Status WHERE reservation_id = @Id";
            cmd.Parameters.AddWithValue("@Status", status.ToString()); cmd.Parameters.AddWithValue("@Id", resId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}
`,
    'WarehouseRepository.cs': `
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.DTOs;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class WarehouseRepository : BaseRepository, IWarehouseRepository
{
    public WarehouseRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<Warehouse?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Warehouse>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Warehouses";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Warehouse>();
            while (await r.ReadAsync()) list.Add(new Warehouse { ItemId = (int)r.GetInt64(0), Quantity = r.GetInt32(1), LowStockThreshold = r.GetInt32(2) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Warehouse entity) {}
    public async Task UpdateAsync(Warehouse entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<Warehouse?> GetByFBIdAsync(long fbId) { return null; }
    public async Task UpdateQuantityAsync(long fbId, int newQuantity) {}
    public async Task<IEnumerable<WarehouseReportRow>> GetReportAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT f.fb_id, f.name, f.type, w.quantity, w.low_stock_threshold, 'NORMAL' FROM Warehouses w JOIN FBs f ON w.fb_id = f.fb_id";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<WarehouseReportRow>();
            while (await r.ReadAsync()) list.Add(new WarehouseReportRow(r.GetInt64(0), r.GetString(1), Enum.Parse<FBType>(r.GetString(2)), r.GetInt32(3), r.GetInt32(4), StockStatus.NORMAL));
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}
`
};

for (const [file, code] of Object.entries(repos)) {
    fs.writeFileSync(path.join(dir, file), code.trim());
}
