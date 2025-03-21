using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    [Route("/customers/registration", "POST")]
    public class RegistrationDTO : IGet, IReturn<RegistrationResponse>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
    }

    public class RegistrationResponse
    {
        public required string Result { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
    }

    [Route("/customers/login", "POST")]
    public class LoginRequestDTO : IReturn<LoginResponse>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } 
        public string Token { get; set; }
    }
}
