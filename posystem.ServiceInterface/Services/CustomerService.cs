using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceStack.OrmLite;
using BCrypt.Net;
using ServiceStack;
using ServiceStack.Data;
using posystem.ServiceModel.Types;
using posystem.ServiceModel.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace posystem.ServiceInterface.Services
{
    public class CustomerService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public CustomerService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        //Method to insert a new customer into the database
        public object Post(RegistrationDTO request)
        {
            try
            {
                using (var db = _dbConnectionFactory.OpenDbConnection())
                {
                    //Check if the email already exists in the database
                    var existingCustomer = db.Single<Customers>(x => x.Email == request.Email);

                    if (existingCustomer != null)
                    {
                        return new { Message = "Email is already registered." };
                    }

                    var newCustomer = new Customers
                    {
                        Id = Guid.NewGuid(),
                        First_Name = request.FirstName,
                        Middle_Name = request.MiddleName,
                        Last_Name = request.LastName,
                        Email = request.Email,
                        Password_Hash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                        PhoneNumber = request.PhoneNumber,
                        DateOfBirth = request.DateOfBirth,
                        AddressLineOne = request.AddressLineOne,
                        AddressLineTwo = request.AddressLineTwo,
                        City = request.City,
                        State = request.State,
                        ZipCode = request.ZipCode,
                        Country = request.Country,
                        Created_At = DateTime.UtcNow,
                        Updated_At = DateTime.UtcNow
                    };

                    db.Insert(newCustomer);

                    return new RegistrationResponse { Result = "Customer created successfully." };
                }
            }
            catch (Exception ex)
            {
                return new { Message = ex.Message };
            }
        }

        // Method to update an existing customer
        public object Put(RegistrationDTO request)
        {
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                // Find the existing customer
                var existingCustomer = db.SingleById<Customers>(request.Id);

                if (existingCustomer == null)
                {
                    return new { Message = "Customer not found." };
                }

                // Update the customer details
                existingCustomer.First_Name = request.FirstName ?? existingCustomer.First_Name;
                existingCustomer.Last_Name = request.LastName ?? existingCustomer.Last_Name;
                existingCustomer.Email = request.Email ?? existingCustomer.Email;
                existingCustomer.PhoneNumber = request.PhoneNumber ?? existingCustomer.PhoneNumber;
                existingCustomer.DateOfBirth = request.DateOfBirth ?? existingCustomer.DateOfBirth;
                existingCustomer.AddressLineOne = request.AddressLineOne ?? existingCustomer.AddressLineOne;
                existingCustomer.AddressLineTwo = request.AddressLineTwo ?? existingCustomer.AddressLineTwo;
                existingCustomer.City = request.City ?? existingCustomer.City;
                existingCustomer.State = request.State ?? existingCustomer.State;
                existingCustomer.ZipCode = request.ZipCode ?? existingCustomer.ZipCode;
                existingCustomer.Country = request.Country ?? existingCustomer.Country;

                // Update the Updated_At field
                existingCustomer.Updated_At = DateTime.UtcNow;

                // Save the updated customer details
                db.Update(existingCustomer);

                return new { Message = "Customer updated successfully." };
            }
        }

        //Method to login a customer
        public object Post(LoginRequestDTO request)
        {
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                // Fetch the customer by email
                var customer = db.Single<Customers>(x => x.Email == request.Email);

                if (customer == null)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Verify the password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, customer.Password_Hash))
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var token = TokenService.GenerateJwtTokenForLogin(customer);  

                return new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token  // Return the token in the response
                };
            }
        }

    }
}
