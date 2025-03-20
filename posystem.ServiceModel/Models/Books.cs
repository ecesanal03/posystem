using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Books")]
    public class Books
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string? AuthorFirstName { get; set; }
        public string? AuthorMiddleName { get; set; }
        public string? AuthorLastName { get; set; }
        public string? ISBN { get; set; }
        public decimal UnitPrice { get; set; }
        public int StockLevel { get; set; }
        public string? Description { get; set; }
        public byte[]? CoverImage { get; set; }
        public DateTime AddedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [References(typeof(Employees))]
        public Guid? CreatedBy { get; set; }

        [References(typeof(Employees))]
        public Guid? UpdatedBy { get; set; }

        [References(typeof(Suppliers))]
        public Guid? SupplierId { get; set; }

        [References(typeof(Discounts))]
        public Guid? DiscountId { get; set; }

        public string? Title { get; set; }
    }
}



// Id CHAR(36) PRIMARY KEY,
// 	Author_FirstName VARCHAR(25) NOT NULL,
// 	Author_MiddleName VARCHAR(25),
// 	Author_LastName VARCHAR(25) NOT NULL,
// 	ISBN VARCHAR(20) UNIQUE NOT NULL,
// 	Unit_Price DECIMAL(10,2) NOT NULL,
// 	Stock_Level INT NOT NULL,
// 	Description TEXT NOT NULL,
// 	Cover_Image BLOB,
// 	Added_At TIMESTAMP DEFAULT NOW(),
// 	Updated_At TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),-- add fk relationships
// 	Created_By VARCHAR(25), -- FK to show which employee created the book
// 	Updated_By VARCHAR(25), -- FK to show which employee updated the book
// 	Supplier_Id CHAR(36) ,
// 	Discount_Id CHAR(36) ,
// 	CONSTRAINT fk_creator_employee FOREIGN KEY (Created_By) REFERENCES Employees(Id) ON DELETE SET NULL,
// 	CONSTRAINT fk_updater_employee FOREIGN KEY (Updated_By) REFERENCES Employees(Id) ON DELETE SET NULL,
// 	-- CONSTRAINT fk_supplier FOREIGN KEY (Supplier_Id) REFERENCES Suppliers(Id) ON DELETE SET NULL,
//     CONSTRAINT fk_discount FOREIGN KEY (Discount_Id) REFERENCES Discounts(Id) ON DELETE SET NULL
