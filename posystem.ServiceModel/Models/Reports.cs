using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Reports")]
    public class Reports
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string Report_Name { get; set; }
        public string? Report_Description { get; set; }
        public string? Report_Format { get; set; }
        public string? Sql_Query { get; set; }
        public DateTime? Created_At { get; set; }
    }
}

