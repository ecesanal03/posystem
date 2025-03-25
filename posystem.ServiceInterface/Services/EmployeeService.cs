using posystem.ServiceModel.Models;
using ServiceStack;
using ServiceStack.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceStack.OrmLite;
using BCrypt.Net;
using posystem.ServiceModel.Types;

namespace posystem.ServiceInterface.Services
{
    public class EmployeeService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public EmployeeService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        //Method to insert a manager into the database
        // public void InsertManager(string firstName, string lastName, string email, string password)
        // {
        //     using (var db = _dbConnectionFactory.OpenDbConnection())
        //     {
        //         var newEmployee = new Employees
        //         {
        //             Id = Guid.NewGuid(),
        //             First_Name = firstName,
        //             Last_Name = lastName,
        //             Email = email,
        //             Password_Hash = BCrypt.Net.BCrypt.HashPassword(password),
        //             PhoneNumber = "123-456-7890", 
        //             DateOfBirth = DateTime.Now.AddYears(-30), 
        //             Employment_Start_Date = DateTime.Now,
        //             Role = "Manager", 
        //             AddressLineOne = "123 Main St", 
        //             City = "Houston",
        //             State = "Texas",
        //             ZipCode = "12345",
        //             Country = "United States"
        //         };

        //         db.Insert(newEmployee);
        //     }   
        // }

        //Method to insert an employee into the database
        public object Post(RegisterEmployeeDTO request)
        {
            try
            {
                using (var db = _dbConnectionFactory.OpenDbConnection())
                {
                    //Check if the email already exists in the database
                    var existingEmployee = db.Single<Employees>(x => x.Email == request.Email);

                    if (existingEmployee != null)
                    {
                        return new RegisterEmployeeResponse { Result = "Error", Message = "Email is already registered." };
                    }

                    var newEmployee = new Employees
                    {
                        Id = Guid.NewGuid(),
                        First_Name = request.FirstName,
                        Middle_Name = request.MiddleName,
                        Last_Name = request.LastName,
                        Email = request.Email,
                        Password_Hash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                        PhoneNumber = request.PhoneNumber,
                        DateOfBirth = request.DateOfBirth,
                        Employment_Start_Date = request.EmploymentStartDate,
                        Role = request.Role,
                        AddressLineOne = request.AddressLineOne,
                        AddressLineTwo = request.AddressLineTwo,
                        City = request.City,
                        State = request.State,
                        ZipCode = request.ZipCode,
                        Country = request.Country
                    };

                    db.Insert(newEmployee);

                    return new RegisterEmployeeResponse { Result = "Success", Message = "Employee registered successfully." };
                }
            }
            catch (Exception ex)
            {
                return new RegisterEmployeeResponse { Result = "Error", Message = ex.Message };
            }
        }

        //Method to login an employee
        public object Post(LoginEmployeeDTO request)
        {
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var employee = db.Single<Employees>(x => x.Email == request.Email);

                if (employee == null)
                {
                    return new LoginEmployeeResponse { Success = false, Message = "Invalid email or password." };
                }

                if (!BCrypt.Net.BCrypt.Verify(request.Password, employee.Password_Hash))
                {
                    return new LoginEmployeeResponse { Success = false, Message = "Invalid email or password." };
                }

                // After successful login, generate JWT token
                var token = TokenService.GenerateJwtToken(request.Email);

                return new LoginEmployeeResponse { Success = true, Message = "Login successful.", Token = token };
            }
        }
    }
}
