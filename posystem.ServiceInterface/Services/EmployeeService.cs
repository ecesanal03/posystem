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
        public void InsertManager(string firstName, string lastName, string email, string password)
        {
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var newEmployee = new Employees
                {
                    Id = Guid.NewGuid(),
                    First_Name = firstName,
                    Last_Name = lastName,
                    Email = email,
                    Password_Hash = BCrypt.Net.BCrypt.HashPassword(password),
                    PhoneNumber = "123-456-7890", 
                    DateOfBirth = DateTime.Now.AddYears(-30), 
                    Employment_Start_Date = DateTime.Now,
                    Role = "Manager", 
                    AddressLineOne = "123 Main St", 
                    City = "Houston",
                    State = "Texas",
                    ZipCode = "12345",
                    Country = "United States"
                };

                db.Insert(newEmployee);
            }   
        }
    }
}
