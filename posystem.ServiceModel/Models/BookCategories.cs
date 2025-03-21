using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("BookCategories")]
    public class BookCategories
    {
        [PrimaryKey, References(typeof(Books))]
        public Guid BookId { get; set; }

        [PrimaryKey, References(typeof(Categories))]
        public Guid CategoryId { get; set; }
    }
}



//You'd only need virtual if you wanted to access the related Employees, Suppliers, and Discounts entities and needed lazy loading or change tracking. Since you're only storing the foreign key IDs and not directly loading related data, there's no need for virtual.