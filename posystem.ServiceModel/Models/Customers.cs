using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Customers")]
    public class Customers
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string First_Name { get; set; }
        public string? Middle_Name { get; set; }
        public string Last_Name { get; set; }
        public string Email { get; set; }
        public string Password_Hash { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public DateTime Created_At { get; set; }
        public DateTime Updated_At { get; set; }
    }
}
