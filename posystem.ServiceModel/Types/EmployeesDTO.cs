using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    public class EmployeesDTO
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }  // We expose role here
        public string PhoneNumber { get; set; }
        public DateTime EmploymentStartDate { get; set; }
    }
}
