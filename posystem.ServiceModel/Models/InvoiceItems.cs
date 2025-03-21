using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("InvoiceItems")]
    public class InvoiceItems
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Invoices))]
        public Guid InvoiceId { get; set; }

        [References(typeof(Books))]
        public Guid BookId { get; set; }

        public int Quantity { get; set; }
    }
}

