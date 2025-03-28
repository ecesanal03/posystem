using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Employees")]
    public class Employees
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string First_Name { get; set; }
        public string Middle_Name { get; set; }
        public string Last_Name { get; set; }
        public string Email { get; set; }
        public string Password_Hash { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime Employment_Start_Date { get; set; }
        public DateTime? Employment_End_Date { get; set; }
        public string AddressLineOne { get; set; }
        public string AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
    }
}

