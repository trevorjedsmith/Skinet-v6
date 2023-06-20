using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Models;
using Core.Services;
using Infrastructure.Services;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Tests
{
    public class OrderServiceTests
    {
        private Mock<IUnitOfWork> _unitOfWorkMock;
        private Mock<IBasketRepository> _basketRepositoryMock;
        private OrderService _orderService;

        public OrderServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _basketRepositoryMock = new Mock<IBasketRepository>();
            _orderService = new OrderService(_basketRepositoryMock.Object, _unitOfWorkMock.Object);
        }

        [Fact]
        public async Task CreateOrderAsync_WithValidData_ReturnsOrder()
        {
            // Arrange
            var buyerEmail = "test@example.com";
            var deliveryMethodId = 1;
            var basketId = "basketId";
            var shippingAddress = new Address { /* Set the address properties for testing */ };
            var basket = new CustomerBasket { Items = new List<BasketItem> { /* Set the basket items for testing */ } };
            var products = new List<Product> { /* Set the products for testing */ };
            var deliveryMethod = new DeliveryMethod { /* Set the delivery method properties for testing */ };
            var orderItems = basket.Items
                .Select(item =>
                {
                    var product = products.FirstOrDefault(p => p.Id == item.Id);
                    return new OrderItem(new ProductItemOrdered
                    {
                        ProductItemId = product.Id,
                        PictureUrl = product.PictureUrl,
                        ProductName = item.ProductName
                    }, product.Price, item.Quantity);
                })
                .ToList();
            var subtotal = orderItems.Sum(item => item.Price * item.Quantity);
            var order = new Order(orderItems, buyerEmail, shippingAddress, deliveryMethod, subtotal, "");

            _basketRepositoryMock.Setup(repo => repo.GetBasketAsync(basketId))
                .ReturnsAsync(basket);
            _unitOfWorkMock.Setup(repo => repo.Repository<Product>().GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((int productId) => products.FirstOrDefault(p => p.Id == productId));
            _unitOfWorkMock.Setup(repo => repo.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId))
                .ReturnsAsync(deliveryMethod);
            _unitOfWorkMock.Setup(repo => repo.Repository<Order>().Add(order));
            _unitOfWorkMock.Setup(repo => repo.Complete())
                .ReturnsAsync(1);
            _basketRepositoryMock.Setup(repo => repo.DeleteBasketAsync(basketId))
                .ReturnsAsync(true);

            // Act
            var result = await _orderService.CreateOrderAsync(buyerEmail, deliveryMethodId, basketId, shippingAddress);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(order.OrderItems.Count, result.OrderItems.Count);
            Assert.Equal(order.BuyerEmail, result.BuyerEmail);
            Assert.Equal(order.ShipToAddress, result.ShipToAddress);
            Assert.Equal(order.DeliveryMethod, result.DeliveryMethod);
            Assert.Equal(order.Subtotal, result.Subtotal);
        }
    }
}
