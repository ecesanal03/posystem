using ServiceStack;
using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Suppliers")]
    public class Suppliers
    {
        [PrimaryKey]
        [Required]
        public Guid Id { get; set; }

        [Required]
        [StringLength(200)]
        public string SupplierName { get; set; }

        [Required]
        [StringLength(255)]
        public string Email { get; set; }


        [StringLength(255)]
        public string? PhoneNumber { get; set; }
        [Required]
        [StringLength(100)]
        public string AddressLineOne { get; set; }
        [StringLength(100)]
        public string? AddressLineTwo { get; set; }
        [Required]
        [StringLength(50)]
        public string City { get; set; }
        [Required]
        [StringLength(2)]
        public string State { get; set; }
        [Required]
        [StringLength(7)]
        public string ZipCode { get; set; }
        [Required]
        [StringLength(25)]
        public string Country { get; set; }

        [Required]
        [Default(typeof(DateTime), "GETUTCDATE()")]
        public DateTime Added_At { get; set; }
    }
}

// CREATE TABLE `Suppliers` (
//   `Id` char(36) NOT NULL,
//   `SupplierName` varchar(255) NOT NULL,
//   `Email` varchar(255) NOT NULL,
//   `PhoneNumber` varchar(255) DEFAULT NULL,
//   `AddressLineOne` varchar(100) NOT NULL,
//   `AddressLineTwo` varchar(100) DEFAULT NULL,
//   `City` varchar(50) NOT NULL,
//   `State` varchar(2) NOT NULL,
//   `ZipCode` varchar(7) NOT NULL,
//   `Country` varchar(25) NOT NULL,
//   PRIMARY KEY (`Id`),
//   UNIQUE KEY `Id_UNIQUE` (`Id`),
//   UNIQUE KEY `Email_UNIQUE` (`Email`),
//   UNIQUE KEY `PhoneNumber_UNIQUE` (`PhoneNumber`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;