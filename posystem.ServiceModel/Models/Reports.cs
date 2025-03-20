using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Reports")]
    public class Reports
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string ReportFormat { get; set; }
        public string? ReportDescription { get; set; }
        public byte[] ReportDocument { get; set; }

        [References(typeof(Employees))]
        public Guid EmployeeId { get; set; }
    }
}

