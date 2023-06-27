using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Models;
using Core.Services;
using Microsoft.Extensions.Configuration;
using Stripe;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public PaymentService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            // Get api key to connect to stripe
            StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];
            var basket = await _basketRepository.GetBasketAsync(basketId);

            if(basket == null)
                return null;

            var shippingPrice = 0m;

            // Reget delivery to get correct price
            if (basket.DeliveryMethodId.HasValue)
            {
                var dm = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(basket.DeliveryMethodId.Value);
                shippingPrice = dm.Price;
            }

            // Checking the client basket for manipulated prices
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Core.Entities.Product>().GetByIdAsync(item.Id);
                if (productItem.Price != item.Price)
                {
                    // resetting the price if it has changed
                    item.Price = productItem.Price;
                }
            }

            // Setup the payment intent which is tied to price in basket
            var service = new PaymentIntentService();
            PaymentIntent intent;
            // If we have no intent create or update it
            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                intent = await service.CreateAsync(options);
                // Set the intent from stripe, this is our id for this transaction
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else
            {
                // if this is an update as we have an intent as the intent is tied to the basket price we need to update
                // the intent with the new price if there is one
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100
                };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            // Save the basket
            await _basketRepository.UpdateBasketAsync(basket);
            return basket;
        }
    }
}
