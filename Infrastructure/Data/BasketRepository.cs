using Core.Entities;
using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly StoreContext _context;

        public BasketRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            var basketFromDb = await _context.Baskets.FirstOrDefaultAsync(x => x.BasketId == basketId);
            if (basketFromDb == null) return false;
            _context.Baskets.Remove(basketFromDb);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            var basketFromDb = await _context.Baskets.FirstOrDefaultAsync(x => x.BasketId == basketId);
            return basketFromDb == null ? null : JsonSerializer.Deserialize<CustomerBasket>(basketFromDb.CustomerBasket);
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var basketFromDb = await _context.Baskets.FirstOrDefaultAsync(x => x.BasketId == basket.Id);
            if (basketFromDb == null)
            {
                // create the basket
                Basket basketEntity = new()
                {
                    BasketId = basket.Id,
                    CustomerBasket = JsonSerializer.Serialize(basket),
                    Created = System.DateTime.Now
                };
                _context.Add(basketEntity);
            }
            else
            {
                // update the basket
                basketFromDb.CustomerBasket = JsonSerializer.Serialize(basket);
                _context.Update(basketFromDb);
            }
            await _context.SaveChangesAsync();
            return await GetBasketAsync(basket.Id);
        }
    }
}
