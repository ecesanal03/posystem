using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Categories")]
    public class Categories
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string? Name { get; set; }

    }
}

