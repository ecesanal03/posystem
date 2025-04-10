using ServiceStack;
using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Books")]
    public class Books
    {
        [PrimaryKey]
        [Required]
        public Guid Id { get; set; }

        [Required]
        [StringLength(200)]
        [Index]
        public string? Title { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        [Index]
        public string? Author { get; set; } = null!;

        [StringLength(20)]
        [Index(Unique = true)]
        public string? ISBN { get; set; }

        [Required]
        [DecimalLength(precision:10, scale:2)]
        public decimal Price { get; set; }

        [Default(0)]
        public int Units { get; set; }

        public string? Description { get; set; }

        public string? Cover_Image { get; set; }

        [Required]
        [Default(typeof(DateTime), "GETUTCDATE()")]
        public DateTime Added_At { get; set; }

        [Required]
        [Default(typeof(DateTime), "GETUTCDATE()")]
        public DateTime Updated_At { get; set; }

        [References(typeof(Employees))]
        [ForeignKey(typeof(Employees), OnDelete = "SET NULL")]
        public Guid? Created_By { get; set; }

        [References(typeof(Employees))]
        [ForeignKey(typeof(Employees), OnDelete = "SET NULL")]
        public Guid? Updated_By { get; set; }

        [References(typeof(Suppliers))]
        [ForeignKey(typeof(Suppliers), OnDelete = "SET NULL")]
        public Guid? Supplier_Id { get; set; }

        [References(typeof(Discounts))]
        [ForeignKey(typeof(Discounts), OnDelete = "SET NULL")]
        public Guid? Discount_Id { get; set; }
    }
}



// CREATE TABLE `Books` (
  // `Id` char(36) NOT NULL,
  // `Author` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  // `ISBN` varchar(20) NOT NULL,
  // `Price` decimal(10,2) NOT NULL,
  // `Units` int NOT NULL,
  // `Description` text NOT NULL,
  // `Cover_Image` varchar(1000),
  // `Added_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  // `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  // `Created_By` varchar(25) DEFAULT NULL,
  // `Updated_By` varchar(25) DEFAULT NULL,
  // `Supplier_Id` char(36) DEFAULT NULL,
  // `Discount_Id` char(36) DEFAULT NULL,
  // `Title` varchar(75) NOT NULL,
  // PRIMARY KEY (`Id`),
  // UNIQUE KEY `ISBN` (`ISBN`),
  // KEY `fk_creator_employee` (`Created_By`),
  // KEY `fk_updater_employee` (`Updated_By`),
  // KEY `fk_discount` (`Discount_Id`),
  // KEY `fk_supplier` (`Supplier_Id`),
  // CONSTRAINT `fk_creator_employee` FOREIGN KEY (`Created_By`) REFERENCES `Employees` (`Id`) ON DELETE SET NULL,
  // CONSTRAINT `fk_discount` FOREIGN KEY (`Discount_Id`) REFERENCES `Discounts` (`Id`) ON DELETE SET NULL,
  // CONSTRAINT `fk_supplier` FOREIGN KEY (`Supplier_Id`) REFERENCES `Suppliers` (`Id`) ON DELETE SET NULL,
  // CONSTRAINT `fk_updater_employee` FOREIGN KEY (`Updated_By`) REFERENCES `Employees` (`Id`) ON DELETE SET NULL
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;