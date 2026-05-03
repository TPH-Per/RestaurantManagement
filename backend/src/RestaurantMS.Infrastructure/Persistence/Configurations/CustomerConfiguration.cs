using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Infrastructure.Persistence.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers");
        builder.HasKey(e => e.CustomerId);

        builder.Property(e => e.CustomerId).HasColumnName("customer_id");
        builder.Property(e => e.FullName).HasColumnName("full_name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Phone).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Password).HasMaxLength(255).IsRequired();
        builder.Property(e => e.Email).HasMaxLength(100);
        builder.Property(e => e.Address).HasMaxLength(255);
        builder.Property(e => e.Gender).HasMaxLength(10);
        builder.Property(e => e.MembershipLevel).HasColumnName("membership_level").HasMaxLength(20).IsRequired();
        builder.Property(e => e.LoyaltyPoints).HasColumnName("loyalty_points");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
    }
}
