using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    [Route("/employee/employeeRegistration", "POST")]
    public class RegisterEmployeeDTO : IReturn<RegisterEmployeeResponse>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }  // We expose role here
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public DateTime EmploymentStartDate { get; set; }
    }

    public class RegisterEmployeeResponse
    {
        public string Result { get; set; }
        public string Message { get; set; }
    }

    [Route("/employee/employeeLogin", "POST")]
    public class LoginEmployeeDTO : IReturn<LoginEmployeeResponse>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginEmployeeResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
    }
}
