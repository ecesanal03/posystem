using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{

    #region request/Response DTOs

    [Route("/customers", "GET")]
    public class GetCustomersDTO : IReturn<GetCustomersResponse>
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }

    public class GetCustomersResponse
    {
        public List<CustomerListDTO> Customers { get; set; } = new List<CustomerListDTO>();
        public int TotalCount { get; set; }
    } 

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

    [Route("/customers/{Id}", "DELETE")]
    public class DeleteCustomerDTO : IReturn<DeleteCustomerResponse>
    {
        public Guid Id { get; set; }
    }

    public class DeleteCustomerResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    #endregion

    #region DTO models 

    public class CustomerListDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Created_At { get; set; }
        public int Orders { get; set; }
        public decimal Total_Spent { get; set; }
    }

    #endregion
}
