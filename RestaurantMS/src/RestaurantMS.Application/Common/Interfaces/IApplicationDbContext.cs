using Microsoft.EntityFrameworkCore;
using RestaurantMS.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Customer> Customers { get; }
    DbSet<DiscountCode> DiscountCodes { get; }
    DbSet<FB> FBs { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<Manufacturer> Manufacturers { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Receipt> Receipts { get; }
    DbSet<ReceiptDetail> ReceiptDetails { get; }
    DbSet<RestaurantOrder> Orders { get; }
    DbSet<RestaurantTable> Tables { get; }
    DbSet<Review> Reviews { get; }
    DbSet<ReviewReply> ReviewReplies { get; }
    DbSet<Staff> Staff { get; }
    DbSet<TableReservation> TableReservations { get; }
    DbSet<Warehouse> Warehouses { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
