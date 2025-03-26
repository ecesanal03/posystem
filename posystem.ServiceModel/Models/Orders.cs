using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Orders")]
    public class Orders
    {
        [PrimaryKey]
        [Required]
        public Guid Id { get; set; }

        [Required]
        [Default(typeof(DateTime), "GETUTCDATE()")]
        public DateTime Order_Date { get; set; }

        [Default(typeof(DateTime), "GETUTCDATE()")]
        public DateTime? Delivery_Date { get; set; }

        [Required]
        [ForeignKey(typeof(Customers), OnDelete = "SET NULL")]
        public Guid Customer_Id { get; set; }

        [Required]
        [StringLength(20)]
        [Default("Pending")]
        public string Order_Status { get; set; }
    }
}



// CREATE TABLE `Orders` (
//   `Id` char(36) NOT NULL,
//   `Order_Date` date NOT NULL,
//   `Delivery_Date` date DEFAULT NULL,
//   `Customer_Id` char(36) NOT NULL,
//   `Order_Status` enum('Pending','Processing','Shipped','Delivered','Cancelled') NOT NULL,
//   PRIMARY KEY (`Id`),
//   KEY `fk_customer` (`Customer_Id`),
//   CONSTRAINT `fk_customer` FOREIGN KEY (`Customer_Id`) REFERENCES `Customers` (`Id`) ON DELETE CASCADE
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
