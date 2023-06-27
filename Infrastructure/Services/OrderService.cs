using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Services;
using Core.Specifications;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IBasketRepository basketRepository, IUnitOfWork unitOfWork)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // Get basket from basket repo
            var basket = await _basketRepository.GetBasketAsync(basketId);
            // Get items from product repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered
                {
                    ProductItemId = productItem.Id,
                    PictureUrl = productItem.PictureUrl,
                    ProductName = item.ProductName
                };
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);

                items.Add(orderItem);
            }

            // Get delivery method
            var dm = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            // Calculate subtotal
            var subtotal = items.Sum(x => x.Price * x.Quantity);
            // Check to see if order exists
            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null)
            {
                order = new Order(items, buyerEmail, shippingAddress, dm, subtotal, basket.PaymentIntentId);
                _unitOfWork.Repository<Order>().Add(order);
            }
            else
            {
                order.BuyerEmail = buyerEmail;
                order.ShipToAddress = shippingAddress;
                order.Subtotal = subtotal;
                _unitOfWork.Repository<Order>().Update(order);
            }
            // Save Order         
            var result = await _unitOfWork.Complete();
            // Check order creation result
            if (result <= 0) return null;
            // Return Order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int orderId, string buyerEmail)
        {
            var spec = new OrdersWithItemAndOrderingSpecification(orderId, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}
