using System;

namespace Core.Entities
{
    public class Basket : BaseEntity
    {
        public string BasketId { get; set; }
        public string CustomerBasket { get; set; }
        /// <summary>
        /// This will be for future use managing baskets
        /// </summary>
        public DateTime Created { get; set; }
    }
}
