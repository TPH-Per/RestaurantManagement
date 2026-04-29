using Microsoft.EntityFrameworkCore;
using System.Reflection;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Infrastructure.Persistence;

public class AppDbContext : DbContext, IApplicationDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<DiscountCode> DiscountCodes => Set<DiscountCode>();
    public DbSet<FB> FBs => Set<FB>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Manufacturer> Manufacturers => Set<Manufacturer>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Receipt> Receipts => Set<Receipt>();
    public DbSet<ReceiptDetail> ReceiptDetails => Set<ReceiptDetail>();
    public DbSet<RestaurantOrder> Orders => Set<RestaurantOrder>();
    public DbSet<RestaurantTable> Tables => Set<RestaurantTable>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReviewReply> ReviewReplies => Set<ReviewReply>();
    public DbSet<Staff> Staff => Set<Staff>();
    public DbSet<TableReservation> TableReservations => Set<TableReservation>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }
}
