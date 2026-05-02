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

public class CategoryRepository : ICategoryRepository
{
    private readonly SqlConnectionFactory _factory;
    public CategoryRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Category?> GetByIdAsync(long id)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Categories WHERE category_id = @Id";
        cmd.Parameters.AddWithValue("@Id", id);
        await using var r = await cmd.ExecuteReaderAsync();
        if (await r.ReadAsync()) return new Category { CategoryId = (int)r.GetInt64(0), Name = r.GetString(1), Type = r.GetString(2) };
        return null;
    }
    public async Task<IEnumerable<Category>> GetAllAsync() { return new List<Category>(); }
    public async Task AddAsync(Category entity) {}
    public async Task UpdateAsync(Category entity) {}
    public async Task DeleteAsync(long id) {}
}
`,
    'ManufacturerRepository.cs': `
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ManufacturerRepository : IManufacturerRepository
{
    private readonly SqlConnectionFactory _factory;
    public ManufacturerRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Manufacturer?> GetByIdAsync(long id)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Manufacturers WHERE manufacturer_id = @Id";
        cmd.Parameters.AddWithValue("@Id", id);
        await using var r = await cmd.ExecuteReaderAsync();
        if (await r.ReadAsync()) return new Manufacturer { ManufacturerId = (int)r.GetInt64(0), Name = r.GetString(1) };
        return null;
    }
    public async Task<IEnumerable<Manufacturer>> GetAllAsync() { return new List<Manufacturer>(); }
    public async Task AddAsync(Manufacturer entity) {}
    public async Task UpdateAsync(Manufacturer entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<long> InsertAndReturnIdAsync(Manufacturer entity) => 1;
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

public class FBRepository : IFBRepository
{
    private readonly SqlConnectionFactory _factory;
    public FBRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<FB?> GetByIdAsync(long id)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM FBs WHERE fb_id = @Id";
        cmd.Parameters.AddWithValue("@Id", id);
        await using var r = await cmd.ExecuteReaderAsync();
        if (await r.ReadAsync()) {
            return new FB { 
                ItemId = (int)r.GetInt64(0), 
                Name = r.GetString(1), 
                Price = r.GetDecimal(2), 
                Type = Enum.Parse<FBType>(r.GetString(3)),
                IsVisible = r.GetBoolean(6)
            };
        }
        return null;
    }
    public async Task<IEnumerable<FB>> GetAllAsync() { return new List<FB>(); }
    public async Task AddAsync(FB entity) {}
    public async Task UpdateAsync(FB entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<FB>> GetMenuAsync(bool includeInhouse = false) { return new List<FB>(); }
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

public class WarehouseRepository : IWarehouseRepository
{
    private readonly SqlConnectionFactory _factory;
    public WarehouseRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Warehouse?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Warehouse>> GetAllAsync() { return new List<Warehouse>(); }
    public async Task AddAsync(Warehouse entity) {}
    public async Task UpdateAsync(Warehouse entity) {}
    public async Task DeleteAsync(long id) {}

    public async Task<Warehouse?> GetByFBIdAsync(long fbId)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT w.*, f.type as fb_type FROM Warehouses w INNER JOIN FBs f ON w.fb_id = f.fb_id WHERE w.fb_id = @Id";
        cmd.Parameters.AddWithValue("@Id", fbId);
        await using var r = await cmd.ExecuteReaderAsync();
        if (await r.ReadAsync()) {
            return new Warehouse { 
                ItemId = (int)r.GetInt64(r.GetOrdinal("fb_id")), 
                CurrentStock = r.GetInt32(r.GetOrdinal("quantity")),
                FBType = Enum.Parse<FBType>(r.GetString(r.GetOrdinal("fb_type")))
            };
        }
        return null;
    }
    
    public async Task UpdateQuantityAsync(long fbId, int newQuantity)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE Warehouses SET quantity = @Qty WHERE fb_id = @Id";
        cmd.Parameters.AddWithValue("@Qty", newQuantity);
        cmd.Parameters.AddWithValue("@Id", fbId);
        await cmd.ExecuteNonQueryAsync();
    }
    
    public async Task<IEnumerable<WarehouseReportRow>> GetReportAsync() { return new List<WarehouseReportRow>(); }
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

public class RestaurantOrderRepository : IRestaurantOrderRepository
{
    private readonly SqlConnectionFactory _factory;
    public RestaurantOrderRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<RestaurantOrder?> GetByIdAsync(long id)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }
    public async Task<IEnumerable<RestaurantOrder>> GetAllAsync() { return new List<RestaurantOrder>(); }
    public async Task AddAsync(RestaurantOrder entity) {}
    public async Task UpdateAsync(RestaurantOrder entity) {}
    public async Task DeleteAsync(long id) {}

    public async Task<RestaurantOrder?> GetWithItemsAsync(long orderId)
    {
        var order = await GetByIdAsync(orderId);
        if (order == null) return null;

        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }
    public async Task<IEnumerable<RestaurantOrder>> GetByTableAsync(long tableId) { return new List<RestaurantOrder>(); }
    
    public async Task<long> InsertAndReturnIdAsync(RestaurantOrder order)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO RestaurantOrders (table_id, reservation_id, customer_id, status, created_at)
                           OUTPUT INSERTED.order_id VALUES (@TId, @ResId, @CId, @Status, @Created)";
        cmd.Parameters.AddWithValue("@TId", order.TableId);
        cmd.Parameters.AddWithValue("@ResId", (object?)order.ReservationId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@CId", (object?)order.CustomerId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Status", order.Status.ToString());
        cmd.Parameters.AddWithValue("@Created", order.CreatedAt);
        return (long)await cmd.ExecuteScalarAsync();
    }
    
    public async Task UpdateStatusAsync(long orderId, OrderStatus status)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE RestaurantOrders SET status = @Status WHERE order_id = @Id";
        cmd.Parameters.AddWithValue("@Status", status.ToString());
        cmd.Parameters.AddWithValue("@Id", orderId);
        await cmd.ExecuteNonQueryAsync();
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

public class OrderItemRepository : IOrderItemRepository
{
    private readonly SqlConnectionFactory _factory;
    public OrderItemRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<OrderItem?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<OrderItem>> GetAllAsync() { return new List<OrderItem>(); }
    public async Task AddAsync(OrderItem entity) {}
    public async Task UpdateAsync(OrderItem entity) {}
    public async Task DeleteAsync(long id) {}

    public async Task<IEnumerable<OrderItem>> GetByOrderIdAsync(long orderId)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }

    public async Task<long> InsertAndReturnIdAsync(OrderItem item)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO OrderItems (order_id, item_id, quantity, unit_price)
                           OUTPUT INSERTED.order_item_id VALUES (@OId, @IId, @Qty, @Price)";
        cmd.Parameters.AddWithValue("@OId", item.OrderId);
        cmd.Parameters.AddWithValue("@IId", item.ItemId);
        cmd.Parameters.AddWithValue("@Qty", item.Quantity);
        cmd.Parameters.AddWithValue("@Price", item.UnitPrice);
        return (long)await cmd.ExecuteScalarAsync();
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

public class InvoiceRepository : IInvoiceRepository
{
    private readonly SqlConnectionFactory _factory;
    public InvoiceRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Invoice?> GetByIdAsync(long id)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }
    public async Task<IEnumerable<Invoice>> GetAllAsync() { return new List<Invoice>(); }
    public async Task AddAsync(Invoice entity) {}

    public async Task UpdateAsync(Invoice entity)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }

    public async Task DeleteAsync(long id) {}
    public async Task<Invoice?> GetByOrderIdAsync(long orderId)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }
    
    public async Task<long> InsertAndReturnIdAsync(Invoice invoice)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO Invoices (order_id, subtotal, discount_amount, total, status)
                           OUTPUT INSERTED.invoice_id VALUES (@OId, @Sub, @Disc, @Total, @Status)";
        cmd.Parameters.AddWithValue("@OId", invoice.OrderId);
        cmd.Parameters.AddWithValue("@Sub", invoice.Subtotal);
        cmd.Parameters.AddWithValue("@Disc", invoice.DiscountAmount);
        cmd.Parameters.AddWithValue("@Total", invoice.Total);
        cmd.Parameters.AddWithValue("@Status", invoice.Status.ToString());
        return (long)await cmd.ExecuteScalarAsync();
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

public class DiscountCodeRepository : IDiscountCodeRepository
{
    private readonly SqlConnectionFactory _factory;
    public DiscountCodeRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<DiscountCode?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<DiscountCode>> GetAllAsync() { return new List<DiscountCode>(); }
    public async Task AddAsync(DiscountCode entity) {}
    public async Task UpdateAsync(DiscountCode entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<DiscountCode?> GetByCodeAsync(string code)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }

    public async Task IncrementUsedCountAsync(long discountCodeId)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE DiscountCodes SET used_count = used_count + 1 WHERE discount_code_id = @Id";
        cmd.Parameters.AddWithValue("@Id", discountCodeId);
        await cmd.ExecuteNonQueryAsync();
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

public class ReviewRepository : IReviewRepository
{
    private readonly SqlConnectionFactory _factory;
    public ReviewRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Review?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Review>> GetAllAsync() { return new List<Review>(); }
    public async Task AddAsync(Review entity) {}
    public async Task UpdateAsync(Review entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<bool> ExistsByInvoiceIdAsync(long invoiceId)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(1) FROM Reviews WHERE invoice_id = @Id";
        cmd.Parameters.AddWithValue("@Id", invoiceId);
        return (int)await cmd.ExecuteScalarAsync() > 0;
    }

    public async Task<long> InsertAndReturnIdAsync(Review review)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO Reviews (invoice_id, customer_id, stars, content, created_at)
                           OUTPUT INSERTED.review_id VALUES (@IId, @CId, @Stars, @Content, @Created)";
        cmd.Parameters.AddWithValue("@IId", review.InvoiceId);
        cmd.Parameters.AddWithValue("@CId", review.CustomerId);
        cmd.Parameters.AddWithValue("@Stars", review.Stars);
        cmd.Parameters.AddWithValue("@Content", review.Content);
        cmd.Parameters.AddWithValue("@Created", review.CreatedAt);
        return (long)await cmd.ExecuteScalarAsync();
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

public class TableReservationRepository : ITableReservationRepository
{
    private readonly SqlConnectionFactory _factory;
    public TableReservationRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<TableReservation?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<TableReservation>> GetAllAsync() { return new List<TableReservation>(); }
    public async Task AddAsync(TableReservation entity) {}
    public async Task UpdateAsync(TableReservation entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<IEnumerable<TableReservation>> GetByCustomerIdAsync(long customerId) { return new List<TableReservation>(); }
    
    public async Task<long> InsertAndReturnIdAsync(TableReservation res)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO TableReservations (customer_id, table_id, reserved_at, guest_count, notes, status)
                           OUTPUT INSERTED.reservation_id VALUES (@CId, @TId, @Date, @GC, @Notes, @Status)";
        cmd.Parameters.AddWithValue("@CId", res.CustomerId);
        cmd.Parameters.AddWithValue("@TId", res.TableId);
        cmd.Parameters.AddWithValue("@Date", res.ReservedAt);
        cmd.Parameters.AddWithValue("@GC", res.GuestCount);
        cmd.Parameters.AddWithValue("@Notes", (object?)res.Notes ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Status", res.Status.ToString());
        return (long)await cmd.ExecuteScalarAsync();
    }

    public async Task UpdateStatusAsync(long reservationId, ReservationStatus status) {}
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

public class ReceiptRepository : IReceiptRepository
{
    private readonly SqlConnectionFactory _factory;
    public ReceiptRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Receipt?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Receipt>> GetAllAsync() { return new List<Receipt>(); }
    public async Task AddAsync(Receipt entity) {}
    public async Task UpdateAsync(Receipt entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<Receipt?> GetWithDetailsAsync(long receiptId) { return null; }

    public async Task<long> InsertAndReturnIdAsync(Receipt receipt)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO Receipts (manufacturer_id, staff_id, imported_at)
                           OUTPUT INSERTED.receipt_id VALUES (@MId, @SId, @Date)";
        cmd.Parameters.AddWithValue("@MId", receipt.ManufacturerId);
        cmd.Parameters.AddWithValue("@SId", receipt.CreatedBy);
        cmd.Parameters.AddWithValue("@Date", receipt.ReceiptDate);
        return (long)await cmd.ExecuteScalarAsync();
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

public class ReceiptDetailRepository : IReceiptDetailRepository
{
    private readonly SqlConnectionFactory _factory;
    public ReceiptDetailRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<ReceiptDetail?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<ReceiptDetail>> GetAllAsync() { return new List<ReceiptDetail>(); }
    public async Task AddAsync(ReceiptDetail entity) {}
    public async Task UpdateAsync(ReceiptDetail entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<long> InsertAndReturnIdAsync(ReceiptDetail entity)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO ReceiptDetails (receipt_id, item_id, quantity, import_price)
                           OUTPUT INSERTED.receipt_detail_id VALUES (@RId, @IId, @Qty, @Price)";
        cmd.Parameters.AddWithValue("@RId", entity.ReceiptId);
        cmd.Parameters.AddWithValue("@IId", entity.ItemId);
        cmd.Parameters.AddWithValue("@Qty", entity.Quantity);
        cmd.Parameters.AddWithValue("@Price", entity.ImportPrice);
        return (long)await cmd.ExecuteScalarAsync();
    }

    public async Task<IEnumerable<ReceiptDetail>> GetByReceiptIdAsync(long receiptId) { return new List<ReceiptDetail>(); }
    public async Task DeleteByReceiptIdAsync(long receiptId) {}
}
`,
    'StaffRepository.cs': `
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class StaffRepository : IStaffRepository
{
    private readonly SqlConnectionFactory _factory;
    public StaffRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Staff?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Staff>> GetAllAsync() { return new List<Staff>(); }
    public async Task AddAsync(Staff entity) {}
    public async Task UpdateAsync(Staff entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<Staff?> GetByEmailAsync(string email)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }
    
    public async Task<long> InsertAndReturnIdAsync(Staff entity) => 1;
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

public class CustomerRepository : ICustomerRepository
{
    private readonly SqlConnectionFactory _factory;
    public CustomerRepository(SqlConnectionFactory factory) => _factory = factory;

    public async Task<Customer?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Customer>> GetAllAsync() { return new List<Customer>(); }
    public async Task AddAsync(Customer entity) {}
    public async Task UpdateAsync(Customer entity) {}
    public async Task DeleteAsync(long id) {}
    
    public async Task<Customer?> GetByPhoneAsync(string phone)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
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
    }
    
    public async Task UpdateLoyaltyPointsAsync(long customerId, int points) {}
    public async Task<long> InsertAndReturnIdAsync(Customer entity)
    {
        await using var conn = await _factory.CreateConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO Customers (phone, full_name, email, password, membership_level, loyalty_points, created_at)
                           OUTPUT INSERTED.customer_id VALUES (@Phone, @Name, @Email, @Pass, 'NORMAL', 0, GETUTCDATE())";
        cmd.Parameters.AddWithValue("@Phone", entity.Phone);
        cmd.Parameters.AddWithValue("@Name", entity.FullName);
        cmd.Parameters.AddWithValue("@Email", (object?)entity.Email ?? System.DBNull.Value);
        cmd.Parameters.AddWithValue("@Pass", entity.Password);
        return (long)await cmd.ExecuteScalarAsync();
    }
}
`
};

for (const [file, code] of Object.entries(repos)) {
    fs.writeFileSync(path.join(dir, file), code.trim());
}
