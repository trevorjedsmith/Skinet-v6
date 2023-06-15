namespace Core.Entities.OrderAggregate
{
    /// <summary>
    /// Address is owned by the order
    /// </summary>
    public class Address
    {
        /// <summary>
        /// Entity framework needs a parameterless constructor
        /// </summary>
        public Address()
        {
        }

        public Address(string firstName, string lastName, string street, string city, string state, string zipCode)
        {
            FirstName = firstName;
            LastName = lastName;
            Street = street;
            City = city;
            State = state;
            ZipCode = zipCode;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
