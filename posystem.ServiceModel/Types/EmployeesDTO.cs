using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    #region request/Response DTOs

    [Route("/employees", "GET")]
    public class GetEmployeesDTO : IReturn<GetEmployeesResponse>
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }

    public class GetEmployeesResponse
    {
        public List<EmployeeListDTO> Employees { get; set; } = new List<EmployeeListDTO>();
        public int TotalCount { get; set; }
    }

    [Route("/employee", "GET")]
    public class GetEmployeeDTO : IReturn<GetEmployeeResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetEmployeeResponse
    {
        public EmployeeDetailsDTO Employee { get; set; }
    }

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

    [Route("/employee", "PUT")]
    public class UpdateEmployeeDTO : IReturn<UpdateEmployeeResponse>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateEmployeeResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public EmployeeDetailsDTO Employee { get; set; }
    }

    [Route("/employee", "DELETE")]
    public class DeleteEmployeeDTO : IReturn<DeleteEmployeeResponse>
    {
        public Guid Id { get; set; }
    }

    public class DeleteEmployeeResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    #endregion

    #region DTOs

    /// <summary>
    /// DTO for displaying employees in list views (e.g., tables, grids)
    /// Contains essential information needed for display
    /// </summary>
    public class EmployeeListDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Start_Date { get; set; }
        public bool Status { get; set; }
    }

    /// <summary>
    /// DTO for detailed employee information, used in edit forms and detailed views
    /// </summary>
    public class EmployeeDetailsDTO
    {
        public Guid Id { get; set; }
        public string First_Name { get; set; }
        public string? Middle_Name { get; set; }
        public string Last_Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
    }

    #endregion
    
    
}
