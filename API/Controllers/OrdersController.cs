using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [HttpPost]
        [ProducesResponseType(typeof(Order), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext?.User?.FindFirst(x => x.Type == ClaimTypes.Email)?.Value;
            var address = _mapper.Map<Address>(orderDto.ShipToAddress);
            var order = await _orderService.CreateOrderAsync
                (email, orderDto.DeliveryMethodId, orderDto.BasketId, address);
            if (order == null)
                return BadRequest(new ApiResponse(400));
            return Ok(order);
        }

        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<OrderToReturnDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IReadOnlyList<Order>>> GetOrdersForUser()
        {
            var email = HttpContext?.User?.FindFirst(x => x.Type == ClaimTypes.Email)?.Value;
            var orders = await _orderService.GetOrdersForUserAsync(email);
            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrderToReturnDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Order>> GetOrderForUser(int id)
        {
            var email = HttpContext?.User?.FindFirst(x => x.Type == ClaimTypes.Email)?.Value;
            var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null)
                return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<OrderToReturnDto>(order));
        }

        [HttpGet("delivery-methods")]
        [ProducesResponseType(typeof(IReadOnlyList<DeliveryMethod>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            var dms = await _orderService.GetDeliveryMethodsAsync();
            return Ok(dms);
        }
    }
}
