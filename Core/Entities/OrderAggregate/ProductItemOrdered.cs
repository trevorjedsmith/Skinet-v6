namespace Core.Entities.OrderAggregate
{
    /// <summary>
    /// This is owned by the order item
    /// This is a product snapshot for the order as product properties change
    /// </summary>
    public class ProductItemOrdered
    {
        /// <summary>
        /// Entity framework needs a parameterless constructor
        /// </summary>
        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(int productItemId, string productName, string pictureUrl)
        {
            ProductItemId = productItemId;
            ProductName = productName;
            PictureUrl = pictureUrl;
        }

        public int ProductItemId { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
    }
}
