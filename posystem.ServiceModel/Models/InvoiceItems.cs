using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("InvoiceItems")]
    public class InvoiceItems
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Invoices))]
        public Guid Invoice_Id { get; set; }

        [References(typeof(Books))]
        public Guid Book_Id { get; set; }

        public int Quantity { get; set; }
    }
}

