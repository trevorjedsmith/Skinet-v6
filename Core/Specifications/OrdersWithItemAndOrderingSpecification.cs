using Core.Entities.OrderAggregate;
using System;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public class OrdersWithItemAndOrderingSpecification : BaseSpecifcation<Order>
    {
        public OrdersWithItemAndOrderingSpecification(string email) :
            base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderBy(o => o.OrderDate);
        }

        public OrdersWithItemAndOrderingSpecification(int id, string email) :
            base(o => o.BuyerEmail == email && o.Id == id)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
        }
    }
}
