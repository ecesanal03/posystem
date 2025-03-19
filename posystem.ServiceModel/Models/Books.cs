using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Models
{
    public class Books
    {
        public required Guid Id { get; set; }
        public required string AuthorFirstName { get; set; }
        public string? AuthorMiddleName { get; set; }
        public required string AuthorLastName { get; set; }
        
        public required string Title { get; set; }
    }
}
