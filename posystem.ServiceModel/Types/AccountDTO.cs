using System;
using System.Collections.Generic;
using ServiceStack;

namespace posystem.ServiceModel.Types
{
    [Route("/customers/me/invoices", "GET")]
    public class GetMyInvoicesDTO : IReturn<GetInvoicesResponse>
    {
        public int Skip { get; set; }
        public int Take { get; set; }
        public string SortBy { get; set; }
        public bool SortDesc { get; set; }
    }

    public class GetInvoicesResponse
    {
        public List<InvoiceDTO> Invoices { get; set; } = new List<InvoiceDTO>();
        public int TotalCount { get; set; }
    }

    public class InvoiceDTO
    {
        public Guid Id { get; set; }
        public DateTime Invoice_Date { get; set; }
        public Guid Order_Id { get; set; }
        public Guid Payment_Id { get; set; }
        public decimal Total_Amount { get; set; }
        public DateTime? Generated_At { get; set; }
        public string Customer_Email { get; set; }
        public DateTime Due_Date { get; set; }
        public string Status { get; set; }
    }
} 