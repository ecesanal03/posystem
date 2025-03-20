using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Suppliers")]
    public class Suppliers
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string SupplierName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
    }
}
