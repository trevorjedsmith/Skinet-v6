using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            // One to One with ProductItemOrdered
            builder.OwnsOne(pi => pi.ItemOrdered, pi => pi.WithOwner());
            builder.Property(i => i.Price).HasColumnType("decimal(18,2)");
        }
    }
}
