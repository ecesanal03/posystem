using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Invoices")]
    public class Invoices
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public DateTime InvoiceDate { get; set; }
        public Guid CustomerId { get; set; }
        public decimal TotalAmount { get; set; }
        public Guid OrderId { get; set; }
        public Guid PaymentId { get; set; }

        public DateTime? GeneratedAt { get; set; }

        [References(typeof(Customers))]
        public Guid Customer { get; set; }

        [References(typeof(Orders))]
        public Guid Order { get; set; }

        [References(typeof(Payments))]
        public Guid Payment { get; set; }
    }
}

