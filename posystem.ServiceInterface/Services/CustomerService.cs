using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceStack.OrmLite;
using Microsoft.AspNetCore.Identity;
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
        private readonly PasswordHasher<object> _passwordHasher;

        public CustomerService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
            _passwordHasher = new PasswordHasher<object>();
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

                    var hashedPassword = _passwordHasher.HashPassword(null, request.Password);

                    var newCustomer = new Customers
                    {
                        Id = Guid.NewGuid(),
                        First_Name = request.FirstName,
                        Middle_Name = request.MiddleName,
                        Last_Name = request.LastName,
                        Email = request.Email,
                        Password_Hash = hashedPassword,
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

                    // After successful registration, generate JWT token
                    var token = TokenService.GenerateJwtToken(request.Email);

                    return new RegistrationResponse { Result = "Customer created successfully.", Token = token };
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
                var customer = db.Single<Customers>(x => x.Email == request.Email);

                if (customer == null)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var verificationResult = _passwordHasher.VerifyHashedPassword(null, customer.Password_Hash, request.Password);
                if (verificationResult == PasswordVerificationResult.Failed)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var token = TokenService.GenerateJwtToken(request.Email);

                return new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token
                };
            }
        }

    }
}
