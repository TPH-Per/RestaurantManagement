using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Manufacturer> Manufacturers { get; }
    DbSet<FB> FBs { get; }
    DbSet<Customer> Customers { get; }
    DbSet<Staff> Staff { get; }
    DbSet<RestaurantTable> Tables { get; }
    DbSet<TableReservation> TableReservations { get; }
    DbSet<RestaurantOrder> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<DiscountCode> DiscountCodes { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<Review> Reviews { get; }
    DbSet<ReviewReply> ReviewReplies { get; }
    DbSet<Receipt> Receipts { get; }
    DbSet<ReceiptDetail> ReceiptDetails { get; }
    DbSet<Warehouse> Warehouses { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
