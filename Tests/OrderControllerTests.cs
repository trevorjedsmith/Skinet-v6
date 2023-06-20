using API.Controllers;
using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Tests
{
    public class OrderControllerTests
    {
        private OrdersController _ordersController;
        private Mock<IOrderService> _orderServiceMock;
        private Mock<IMapper> _mapperMock;

        public OrderControllerTests()
        {
            _orderServiceMock = new Mock<IOrderService>();
            _mapperMock = new Mock<IMapper>();
            _ordersController = new OrdersController(_orderServiceMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task CreateOrder_WithValidData_Returns201Created()
        {
            // Arrange
            var orderDto = new OrderDto
            {
                // Initialize the orderDto properties with valid data for testing
            };
            var expectedOrder = new Order
            {
                // Set the expected order properties for comparison
            };

            _orderServiceMock.Setup(x => x.CreateOrderAsync(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Address>()))
                .ReturnsAsync(expectedOrder);

            // Act
            var result = await _ordersController.CreateOrder(orderDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
            Assert.Equal(expectedOrder, okResult.Value);
        }

        [Fact]
        public async Task CreateOrder_WithInvalidData_Returns400BadRequest()
        {
            // Arrange
            var orderDto = new OrderDto
            {
                // Initialize the orderDto properties with invalid data for testing
            };

            _orderServiceMock.Setup(x => x.CreateOrderAsync(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Address>()))
                .ReturnsAsync((Order)null);

            // Act
            var result = await _ordersController.CreateOrder(orderDto);

            // Assert
            var badRequestObjectResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestObjectResult.StatusCode);
            Assert.IsType<ApiResponse>(badRequestObjectResult.Value);
        }

        [Fact]
        public async Task GetOrdersForUser_WithValidUser_Returns200OK()
        {
            // Arrange
            var email = "test@example.com";
            var expectedOrders = new List<Order>
            {
                new Order { /* Set the expected order properties for testing */ },
                new Order { /* Set the expected order properties for testing */ }
            };

            _orderServiceMock.Setup(x => x.GetOrdersForUserAsync(email))
                .ReturnsAsync(expectedOrders);

            _mapperMock.Setup(x => x.Map<IReadOnlyList<OrderToReturnDto>>(It.IsAny<List<Order>>()))
                .Returns(new List<OrderToReturnDto>
                {
                    new OrderToReturnDto { /* Set the expected OrderToReturnDto properties for testing */ },
                    new OrderToReturnDto { /* Set the expected OrderToReturnDto properties for testing */ }
                });

            // Act
            var result = await _ordersController.GetOrdersForUser();

            // Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status200OK, okObjectResult.StatusCode);

            var orders = Assert.IsAssignableFrom<IReadOnlyList<OrderToReturnDto>>(okObjectResult.Value);
            Assert.Equal(expectedOrders.Count, orders.Count());
        }
    }
}
