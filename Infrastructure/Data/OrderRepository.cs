using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(StoreContext context) : base(context)
        {
        }
    }
}
