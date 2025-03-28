using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    [Route("/reviews/create", "POST")]
    public class CreateReviewDTO : IGet, IReturn<CreateReviewResponse>
    {
        public Guid CustomerId { get; set; }
        public Guid BookId { get; set; }
        public int Rating { get; set; }
        public string? Description { get; set; }
        public DateTime ReviewDate { get; set; }
    }

    public class CreateReviewResponse
    {
        public string? Result { get; set; }
        public string? Message { get; set; }
    }

    [Route("/reviews/retrieve", "GET")]
    public class RetrieveReviewDTO : IGet, IReturn<RetrieveReviewResponse>
    {
        public Guid Id { get; set; }
        public Guid BookId { get; set; }
    }

    public class RetrieveReviewResponse
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid BookId { get; set; }
        public int Rating { get; set; }
        public string? Description { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}