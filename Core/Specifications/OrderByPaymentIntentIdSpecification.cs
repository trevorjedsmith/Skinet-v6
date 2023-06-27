using Core.Entities.OrderAggregate;
using System;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecifcation<Order>
    {
        public OrderByPaymentIntentIdSpecification(string paymentIntentId) : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}
