using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            // One to One with Address
            builder.OwnsOne(o => o.ShipToAddress, a => a.WithOwner());
            builder.Navigation(a => a.ShipToAddress).IsRequired();
            builder.Property(s => s.Status)
              .HasConversion(
                  o => o.ToString(),
                  o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o)
              );
            // One to Many with OrderItems with cascade delete so no orphan OrderItems
            builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
