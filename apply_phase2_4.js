const fs = require('fs');
const path = require('path');

const dir = 'RestaurantMS/src/RestaurantMS.Infrastructure/Repositories';

const repos = {
    'CategoryRepository.cs': `
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
`,
    'ManufacturerRepository.cs': `
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ManufacturerRepository : BaseRepository, IManufacturerRepository
{
    public ManufacturerRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<Manufacturer?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Manufacturers WHERE manufacturer_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) return new Manufacturer { ManufacturerId = (int)r.GetInt64(0), Name = r.GetString(1) };
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<Manufacturer>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Manufacturers ORDER BY name";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Manufacturer>();
            while (await r.ReadAsync()) list.Add(new Manufacturer { ManufacturerId = (int)r.GetInt64(0), Name = r.GetString(1) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Manufacturer entity) {}
    public async Task UpdateAsync(Manufacturer entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<long> InsertAndReturnIdAsync(Manufacturer entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "INSERT INTO Manufacturers (name, address, phone) OUTPUT INSERTED.manufacturer_id VALUES (@Name, @Addr, @Phone)";
            cmd.Parameters.AddWithValue("@Name", entity.Name);
            cmd.Parameters.AddWithValue("@Addr",  (object?)entity.Address ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Phone", (object?)entity.Phone   ?? DBNull.Value);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}
`,
    'FBRepository.cs': `
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class FBRepository : BaseRepository, IFBRepository
{
    public FBRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<FB?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM FBs WHERE fb_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new FB { 
                    ItemId = (int)r.GetInt64(0), 
                    Name = r.GetString(1), 
                    Price = r.GetDecimal(2), 
                    Type = Enum.Parse<FBType>(r.GetString(3)),
                    CategoryId = (int)r.GetInt64(r.GetOrdinal("category_id")),
                    IsVisible = r.GetBoolean(6),
                    Unit = r.IsDBNull(r.GetOrdinal("unit")) ? null : r.GetString(r.GetOrdinal("unit"))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<FB>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM FBs";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<FB>();
            while (await r.ReadAsync()) {
                list.Add(new FB { 
                    ItemId = (int)r.GetInt64(0), 
                    Name = r.GetString(1), 
                    Price = r.GetDecimal(2), 
                    Type = Enum.Parse<FBType>(r.GetString(3)),
                    CategoryId = (int)r.GetInt64(r.GetOrdinal("category_id")),
                    IsVisible = r.GetBoolean(6),
                    Unit = r.IsDBNull(r.GetOrdinal("unit")) ? null : r.GetString(r.GetOrdinal("unit"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(FB entity) {}
    public async Task UpdateAsync(FB entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<FB>> GetMenuAsync(bool includeInhouse = false) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = includeInhouse
                ? "SELECT * FROM FBs WHERE type != 'FRESH_RAW' AND is_visible = 1"
                : "SELECT * FROM FBs WHERE type = 'REGULAR' AND is_visible = 1";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<FB>();
            while (await r.ReadAsync()) {
                list.Add(new FB { 
                    ItemId = (int)r.GetInt64(0), 
                    Name = r.GetString(1), 
                    Price = r.GetDecimal(2), 
                    Type = Enum.Parse<FBType>(r.GetString(3)),
                    CategoryId = (int)r.GetInt64(r.GetOrdinal("category_id")),
                    IsVisible = r.GetBoolean(6),
                    Unit = r.IsDBNull(r.GetOrdinal("unit")) ? null : r.GetString(r.GetOrdinal("unit"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<long> InsertAndReturnIdAsync(FB entity) => 1;
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
    public async Task<IEnumerable<Warehouse>> GetAllAsync() { return new List<Warehouse>(); }
    public async Task AddAsync(Warehouse entity) {}
    public async Task UpdateAsync(Warehouse entity) {}
    public async Task DeleteAsync(long id) {}

    public async Task<Warehouse?> GetByFBIdAsync(long fbId)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT w.*, f.type as fb_type FROM Warehouses w INNER JOIN FBs f ON w.fb_id = f.fb_id WHERE w.fb_id = @Id";
            cmd.Parameters.AddWithValue("@Id", fbId);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new Warehouse { 
                    ItemId = (int)r.GetInt64(r.GetOrdinal("fb_id")), 
                    Quantity = r.GetInt32(r.GetOrdinal("quantity")),
                    FBType = Enum.Parse<FBType>(r.GetString(r.GetOrdinal("fb_type")))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    
    public async Task UpdateQuantityAsync(long fbId, int newQuantity)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE Warehouses SET quantity = @Qty WHERE fb_id = @Id";
            cmd.Parameters.AddWithValue("@Qty", newQuantity);
            cmd.Parameters.AddWithValue("@Id", fbId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    
    public async Task<IEnumerable<WarehouseReportRow>> GetReportAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"
                SELECT f.fb_id, f.name, f.type, w.quantity, w.low_stock_threshold,
                       CASE WHEN w.quantity = 0 THEN 'OUT_OF_STOCK'
                            WHEN w.quantity <= w.low_stock_threshold THEN 'LOW_STOCK'
                            ELSE 'NORMAL' END AS stock_status
                FROM Warehouses w
                INNER JOIN FBs f ON f.fb_id = w.fb_id
                ORDER BY CASE WHEN w.quantity = 0 THEN 0 WHEN w.quantity <= w.low_stock_threshold THEN 1 ELSE 2 END, f.name";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<WarehouseReportRow>();
            while (await r.ReadAsync()) {
                list.Add(new WarehouseReportRow(
                    r.GetInt64(0), r.GetString(1), Enum.Parse<FBType>(r.GetString(2)),
                    r.GetInt32(3), r.GetInt32(4), Enum.Parse<StockStatus>(r.GetString(5))
                ));
            }
            return list;
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

    public async Task<RestaurantOrder?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantOrders WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (await r.ReadAsync()) {
                return new RestaurantOrder {
                    OrderId = r.GetInt64(r.GetOrdinal("order_id")),
                    TableId = (int)r.GetInt64(r.GetOrdinal("table_id")),
                    Status = Enum.Parse<OrderStatus>(r.GetString(r.GetOrdinal("status"))),
                    CreatedAt = r.GetDateTime(r.GetOrdinal("created_at"))
                };
            }
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
            while (await r.ReadAsync()) {
                list.Add(new RestaurantOrder {
                    OrderId = r.GetInt64(r.GetOrdinal("order_id")),
                    TableId = (int)r.GetInt64(r.GetOrdinal("table_id")),
                    Status = Enum.Parse<OrderStatus>(r.GetString(r.GetOrdinal("status"))),
                    CreatedAt = r.GetDateTime(r.GetOrdinal("created_at"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(RestaurantOrder entity) {}
    public async Task UpdateAsync(RestaurantOrder entity) {}
    public async Task DeleteAsync(long id) {}

    public async Task<RestaurantOrder?> GetWithItemsAsync(long orderId)
    {
        var order = await GetByIdAsync(orderId);
        if (order == null) return null;

        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM OrderItems WHERE order_id = @Id";
            cmd.Parameters.AddWithValue("@Id", orderId);
            await using var r = await cmd.ExecuteReaderAsync();
            order.OrderItems = new List<OrderItem>();
            while (await r.ReadAsync())
            {
                order.OrderItems.Add(new OrderItem {
                    OrderItemId = r.GetInt64(r.GetOrdinal("order_item_id")),
                    OrderId = r.GetInt64(r.GetOrdinal("order_id")),
                    ItemId = (int)r.GetInt64(r.GetOrdinal("item_id")),
                    Quantity = r.GetInt32(r.GetOrdinal("quantity")),
                    UnitPrice = r.GetDecimal(r.GetOrdinal("unit_price"))
                });
            }
            return order;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<RestaurantOrder>> GetByTableAsync(long tableId) { return new List<RestaurantOrder>(); }
    
    public async Task<long> InsertAndReturnIdAsync(RestaurantOrder order)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO RestaurantOrders (table_id, reservation_id, customer_id, status, created_at)
                               OUTPUT INSERTED.order_id VALUES (@TId, @ResId, @CId, @Status, @Created)";
            cmd.Parameters.AddWithValue("@TId", order.TableId);
            cmd.Parameters.AddWithValue("@ResId", (object?)order.ReservationId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@CId", (object?)order.CustomerId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", order.Status.ToString());
            cmd.Parameters.AddWithValue("@Created", order.CreatedAt);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    
    public async Task UpdateStatusAsync(long orderId, OrderStatus status)
    {
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
    public async Task<IEnumerable<OrderItem>> GetAllAsync() { return new List<OrderItem>(); }
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
                list.Add(new OrderItem {
                    OrderItemId = r.GetInt64(r.GetOrdinal("order_item_id")),
                    OrderId = r.GetInt64(r.GetOrdinal("order_id")),
                    ItemId = (int)r.GetInt64(r.GetOrdinal("item_id")),
                    Quantity = r.GetInt32(r.GetOrdinal("quantity")),
                    UnitPrice = r.GetDecimal(r.GetOrdinal("unit_price"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task<long> InsertAndReturnIdAsync(OrderItem item)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO OrderItems (order_id, item_id, quantity, unit_price)
                               OUTPUT INSERTED.order_item_id VALUES (@OId, @IId, @Qty, @Price)";
            cmd.Parameters.AddWithValue("@OId", item.OrderId);
            cmd.Parameters.AddWithValue("@IId", item.ItemId);
            cmd.Parameters.AddWithValue("@Qty", item.Quantity);
            cmd.Parameters.AddWithValue("@Price", item.UnitPrice);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}
`,
    'InvoiceRepository.cs': `
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
`,
    'DiscountCodeRepository.cs': `
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
    public async Task<IEnumerable<Review>> GetAllAsync() { return new List<Review>(); }
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
            cmd.CommandText = @"INSERT INTO Reviews (invoice_id, customer_id, stars, content, created_at)
                               OUTPUT INSERTED.review_id VALUES (@IId, @CId, @Stars, @Content, @Created)";
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
            if (!await r.ReadAsync()) return null;
            return new TableReservation {
                ReservationId = r.GetInt64(r.GetOrdinal("reservation_id")),
                CustomerId    = r.GetInt64(r.GetOrdinal("customer_id")),
                TableId       = (int)r.GetInt64(r.GetOrdinal("table_id")),
                ReservedAt    = r.GetDateTime(r.GetOrdinal("reserved_at")),
                GuestCount    = r.GetInt32(r.GetOrdinal("guest_count")),
                Notes         = r.IsDBNull(r.GetOrdinal("notes")) ? null : r.GetString(r.GetOrdinal("notes")),
                Status        = Enum.Parse<ReservationStatus>(r.GetString(r.GetOrdinal("status"))),
            };
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<TableReservation>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM TableReservations ORDER BY reserved_at DESC";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<TableReservation>();
            while (await r.ReadAsync()) {
                list.Add(new TableReservation {
                    ReservationId = r.GetInt64(r.GetOrdinal("reservation_id")),
                    CustomerId    = r.GetInt64(r.GetOrdinal("customer_id")),
                    TableId       = (int)r.GetInt64(r.GetOrdinal("table_id")),
                    ReservedAt    = r.GetDateTime(r.GetOrdinal("reserved_at")),
                    GuestCount    = r.GetInt32(r.GetOrdinal("guest_count")),
                    Notes         = r.IsDBNull(r.GetOrdinal("notes")) ? null : r.GetString(r.GetOrdinal("notes")),
                    Status        = Enum.Parse<ReservationStatus>(r.GetString(r.GetOrdinal("status"))),
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(TableReservation entity) {}
    public async Task UpdateAsync(TableReservation entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<TableReservation>> GetByCustomerIdAsync(long customerId) { return new List<TableReservation>(); }
    
    public async Task<long> InsertAndReturnIdAsync(TableReservation res)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO TableReservations (customer_id, table_id, reserved_at, guest_count, notes, status)
                               OUTPUT INSERTED.reservation_id VALUES (@CId, @TId, @Date, @GC, @Notes, @Status)";
            cmd.Parameters.AddWithValue("@CId", res.CustomerId);
            cmd.Parameters.AddWithValue("@TId", res.TableId);
            cmd.Parameters.AddWithValue("@Date", res.ReservedAt);
            cmd.Parameters.AddWithValue("@GC", res.GuestCount);
            cmd.Parameters.AddWithValue("@Notes", (object?)res.Notes ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", res.Status.ToString());
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task UpdateStatusAsync(long reservationId, ReservationStatus status) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE TableReservations SET status = @Status WHERE reservation_id = @Id";
            cmd.Parameters.AddWithValue("@Status", status.ToString());
            cmd.Parameters.AddWithValue("@Id", reservationId);
            await cmd.ExecuteNonQueryAsync();
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
    public async Task<IEnumerable<Receipt>> GetAllAsync() { return new List<Receipt>(); }
    public async Task AddAsync(Receipt entity) {}
    public async Task UpdateAsync(Receipt entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<Receipt?> GetWithDetailsAsync(long receiptId) { return null; }

    public async Task<long> InsertAndReturnIdAsync(Receipt receipt)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO Receipts (manufacturer_id, staff_id, imported_at)
                               OUTPUT INSERTED.receipt_id VALUES (@MId, @SId, @Date)";
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
    public async Task<IEnumerable<ReceiptDetail>> GetAllAsync() { return new List<ReceiptDetail>(); }
    public async Task AddAsync(ReceiptDetail entity) {}
    public async Task UpdateAsync(ReceiptDetail entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<long> InsertAndReturnIdAsync(ReceiptDetail entity)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = @"INSERT INTO ReceiptDetails (receipt_id, item_id, quantity, import_price)
                               OUTPUT INSERTED.receipt_detail_id VALUES (@RId, @IId, @Qty, @Price)";
            cmd.Parameters.AddWithValue("@RId", entity.ReceiptId);
            cmd.Parameters.AddWithValue("@IId", entity.ItemId);
            cmd.Parameters.AddWithValue("@Qty", entity.Quantity);
            cmd.Parameters.AddWithValue("@Price", entity.ImportPrice);
            return (long)await cmd.ExecuteScalarAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }

    public async Task<IEnumerable<ReceiptDetail>> GetByReceiptIdAsync(long receiptId) { return new List<ReceiptDetail>(); }
    public async Task DeleteByReceiptIdAsync(long receiptId) {}
}
`,
    'StaffRepository.cs': `
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
`,
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

    public async Task<Customer?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Customer>> GetAllAsync() { return new List<Customer>(); }
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
            if (await r.ReadAsync()) {
                return new Customer {
                    CustomerId = r.GetInt64(r.GetOrdinal("customer_id")),
                    FullName = r.GetString(r.GetOrdinal("full_name")),
                    Phone = r.GetString(r.GetOrdinal("phone")),
                    Password = r.GetString(r.GetOrdinal("password"))
                };
            }
            return null;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    
    public async Task UpdateLoyaltyPointsAsync(long customerId, int points) {}
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
    'RestaurantTableRepository.cs': `
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class RestaurantTableRepository : BaseRepository, IRestaurantTableRepository
{
    public RestaurantTableRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}

    public async Task<RestaurantTable?> GetByIdAsync(long id)
    {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantTables WHERE table_id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            await using var r = await cmd.ExecuteReaderAsync();
            if (!await r.ReadAsync()) return null;
            return new RestaurantTable {
                TableId = (int)r.GetInt64(r.GetOrdinal("table_id")),
                Status = Enum.Parse<TableStatus>(r.GetString(r.GetOrdinal("status"))),
                Capacity = r.GetInt32(r.GetOrdinal("capacity"))
            };
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task<IEnumerable<RestaurantTable>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM RestaurantTables ORDER BY table_id";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<RestaurantTable>();
            while (await r.ReadAsync()) {
                list.Add(new RestaurantTable {
                    TableId = (int)r.GetInt64(r.GetOrdinal("table_id")),
                    Status = Enum.Parse<TableStatus>(r.GetString(r.GetOrdinal("status"))),
                    Capacity = r.GetInt32(r.GetOrdinal("capacity"))
                });
            }
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(RestaurantTable entity) {}
    public async Task UpdateAsync(RestaurantTable entity) {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "UPDATE RestaurantTables SET status = @Status WHERE table_id = @Id";
            cmd.Parameters.AddWithValue("@Status", entity.Status.ToString());
            cmd.Parameters.AddWithValue("@Id", entity.TableId);
            await cmd.ExecuteNonQueryAsync();
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task DeleteAsync(long id) {}
}
`
};

for (const [file, code] of Object.entries(repos)) {
    fs.writeFileSync(path.join(dir, file), code.trim());
}
