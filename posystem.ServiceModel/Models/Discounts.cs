using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Discounts")]
    public class Discounts
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public decimal Percentage { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string? Discount_Name { get; set; }
        
        [References(typeof(Employees))]
        public Guid Employee_id { get; set; }
    }
}

//CREATE TABLE `Discounts` (
//  `Id` char(36) NOT NULL,
//  `Percentage` float NOT NULL DEFAULT '0.95',
//  `Start_Date` date DEFAULT NULL,
//  `End_Date` date DEFAULT NULL,
//  `Employee_id` char(36) DEFAULT NULL,
//  `Discount_Name` varchar(75) NOT NULL,
//  PRIMARY KEY (`Id`),
//  KEY `Employee_Id_idx` (`Employee_id`),
//  CONSTRAINT `Employee_Id` FOREIGN KEY (`Employee_id`) REFERENCES `Employees` (`Id`)
//) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
