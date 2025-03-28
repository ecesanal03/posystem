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

        //Method to get a list of employees
        public async Task<GetEmployeesResponse> Get(GetEmployeesDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();
            
            var query = db.From<Employees>();

            // Applt filtering by search term if provided
            if(!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(e => 
                e.Id.ToString().Contains(request.SearchTerm) ||
                e.First_Name.Contains(request.SearchTerm) || 
                e.Last_Name.Contains(request.SearchTerm) ||
                e.Email.Contains(request.SearchTerm));
            }

            // Apply sorting
            if(!string.IsNullOrEmpty(request.SortBy))
            {
                query = request.SortDesc
                    ? query.OrderByDescending(request.SortBy)
                    : query.OrderBy(request.SortBy);
            } else {
                query = query.OrderByDescending(e => e.Employment_Start_Date);
            }

            // Get total count for pagination
            var totalCount = await db.CountAsync(query);

            if(request.Skip > 0)
                query = query.Skip(request.Skip);
            
            if(request.Take > 0)
                query = query.Take(request.Take);

            var employees = await db.SelectAsync(query);

            // Map to DTOs
            string sql = @"
                SELECT 
                    e.Id,
                    CONCAT(e.First_Name, ' ', e.Last_Name) AS Name,
                    e.Email,
                    e.Role,
                    DATE_FORMAT(e.Employment_Start_Date, '%m/%d/%Y') AS Start_Date,
                    e.IsActive AS Status
                FROM Employees e
                ORDER BY e.Employment_Start_Date DESC
                LIMIT @Take OFFSET @Skip";

            var parameters = new { request.Skip, request.Take };
            var employeeDtos = await db.SelectAsync<EmployeeListDTO>(sql, parameters);

            /*// Log the results
            Console.WriteLine("Query returned {0} employees", employeeDtos.Count);
            foreach (var employee in employeeDtos)
            {
                Console.WriteLine("{0}, {1}, {2}, {3}, {4}, {5}",
                    employee.Id,
                    employee.Name,
                    employee.Email,
                    employee.Role,
                    employee.Start_Date,
                    employee.Status);
            }
            */
            return new GetEmployeesResponse
            {
                Employees = employeeDtos,
                TotalCount = (int)totalCount
            };

        }

        //Method to get a single employee by ID
        public async Task<GetEmployeeResponse> Get(GetEmployeeDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var employee = await db.SingleByIdAsync<Employees>(request.Id);
                
            if(employee == null)
                throw HttpError.NotFound("Employee not found");

            var employeeDto = new EmployeeDetailsDTO
            {
                Id = employee.Id,
                First_Name = employee.First_Name,
                Middle_Name = employee.Middle_Name,
                Last_Name = employee.Last_Name,
                Email = employee.Email,
                PhoneNumber = employee.PhoneNumber,
                DateOfBirth = employee.DateOfBirth,
                AddressLineOne = employee.AddressLineOne,
                AddressLineTwo = employee.AddressLineTwo,
                City = employee.City,
                State = employee.State,
                ZipCode = employee.ZipCode,
                Country = employee.Country,
                Role = employee.Role,
                IsActive = employee.IsActive
            };

            Console.WriteLine("Getting employee Id: {0}", request.Id);
            Console.WriteLine("{0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11}, {12}, {13}, {14}",
                employeeDto.Id,
                employeeDto.First_Name,
                employeeDto.Middle_Name,
                employeeDto.Last_Name,
                employeeDto.Email,
                employeeDto.PhoneNumber,
                employeeDto.DateOfBirth,
                employeeDto.AddressLineOne,
                employeeDto.AddressLineTwo,
                employeeDto.City,
                employeeDto.State,
                employeeDto.ZipCode,
                employeeDto.Country,
                employeeDto.Role,
                employeeDto.IsActive);

            return new GetEmployeeResponse { Employee = employeeDto };
        }

        //Method to insert an employee into the database
        public async Task<RegisterEmployeeResponse> Post(RegisterEmployeeDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            try
            {
                // Log incoming request data for debugging
                Console.WriteLine("Received employee registration request with data:");
                Console.WriteLine($"FirstName: '{request.FirstName}', LastName: '{request.LastName}'");
                Console.WriteLine($"Email: '{request.Email}', Role: '{request.Role}'");
                Console.WriteLine($"Phone: '{request.PhoneNumber}', DOB: '{request.DateOfBirth}'");
                Console.WriteLine($"Address: '{request.AddressLineOne}', City: '{request.City}', State: '{request.State}'");
                Console.WriteLine($"Zip: '{request.ZipCode}', Country: '{request.Country}'");
                
                //Check if the email already exists in the database
                var existingEmployee = db.Single<Employees>(x => x.Email == request.Email);

                if (existingEmployee != null)
                {
                    return new RegisterEmployeeResponse { 
                        Result = "Error", 
                        Message = "Email is already registered." 
                    };
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
                    Country = request.Country,
                    IsActive = true // Set status to active by default
                };

                await db.InsertAsync(newEmployee);
                
                Console.WriteLine($"Employee created: {newEmployee.First_Name} {newEmployee.Last_Name} ({newEmployee.Email})");

                return new RegisterEmployeeResponse { 
                    Result = "Success", 
                    Message = "Employee registered successfully." 
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating employee: {ex.Message}");
                return new RegisterEmployeeResponse { 
                    Result = "Error", 
                    Message = ex.Message 
                };
            }
        }

        //Method to update an employee
        public async Task<UpdateEmployeeResponse> Put(UpdateEmployeeDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();
            
            try
            {
                Console.WriteLine($"Attempting to update employee with ID: {request.Id}");
                var employee = await db.SingleByIdAsync<Employees>(request.Id);
                
                if(employee == null)
                {
                    Console.WriteLine($"Employee with ID {request.Id} not found");
                    return new UpdateEmployeeResponse 
                    { 
                        Success = false,
                        Message = "Employee not found" 
                    };
                }

                // Helper function to set property only if value is provided
                string UpdateIfNotEmpty(string currentValue, string newValue)
                {
                    return !string.IsNullOrEmpty(newValue) ? newValue : currentValue;
                }

                // Update the employee details (more concise approach)
                employee.First_Name = UpdateIfNotEmpty(employee.First_Name, request.FirstName);
                employee.Middle_Name = UpdateIfNotEmpty(employee.Middle_Name, request.MiddleName);
                employee.Last_Name = UpdateIfNotEmpty(employee.Last_Name, request.LastName);
                employee.Email = UpdateIfNotEmpty(employee.Email, request.Email);
                employee.PhoneNumber = UpdateIfNotEmpty(employee.PhoneNumber, request.PhoneNumber);
                employee.Role = UpdateIfNotEmpty(employee.Role, request.Role);
                employee.AddressLineOne = UpdateIfNotEmpty(employee.AddressLineOne, request.AddressLineOne);
                employee.AddressLineTwo = UpdateIfNotEmpty(employee.AddressLineTwo, request.AddressLineTwo);
                employee.City = UpdateIfNotEmpty(employee.City, request.City);
                employee.State = UpdateIfNotEmpty(employee.State, request.State);
                employee.ZipCode = UpdateIfNotEmpty(employee.ZipCode, request.ZipCode);
                employee.Country = UpdateIfNotEmpty(employee.Country, request.Country);
                
                // Parse date of birth if provided
                if (!string.IsNullOrEmpty(request.DateOfBirth) && DateTime.TryParse(request.DateOfBirth, out DateTime dob))
                    employee.DateOfBirth = dob;
                
                // Update status
                employee.IsActive = request.IsActive;

                // If password is provided, update it
                if (!string.IsNullOrEmpty(request.Password))
                {
                    employee.Password_Hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                }

                // Update the employee in the database
                await db.UpdateAsync(employee);
                
                Console.WriteLine($"Employee updated successfully: {employee.First_Name} {employee.Last_Name} ({employee.Email})");

                // Get the updated employee for the response
                var updatedEmployee = new EmployeeDetailsDTO
                {
                    Id = employee.Id,
                    First_Name = employee.First_Name,
                    Middle_Name = employee.Middle_Name,
                    Last_Name = employee.Last_Name,
                    Email = employee.Email,
                    PhoneNumber = employee.PhoneNumber,
                    DateOfBirth = employee.DateOfBirth,
                    AddressLineOne = employee.AddressLineOne,
                    AddressLineTwo = employee.AddressLineTwo,
                    City = employee.City,
                    State = employee.State,
                    ZipCode = employee.ZipCode,
                    Country = employee.Country,
                    Role = employee.Role,
                    IsActive = employee.IsActive
                };

                return new UpdateEmployeeResponse 
                { 
                    Success = true,
                    Message = "Employee updated successfully",
                    Employee = updatedEmployee
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating employee: {ex.Message}");
                return new UpdateEmployeeResponse 
                { 
                    Success = false,
                    Message = $"Error updating employee: {ex.Message}" 
                };
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

        //Method to delete an employee
        public async Task<DeleteEmployeeResponse> Delete(DeleteEmployeeDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var employee = await db.SingleByIdAsync<Employees>(request.Id);
            if(employee == null)
                return new DeleteEmployeeResponse {
                    Success = false,
                    Message = "Employee not found"
                };

            // Delete the employee directly
            await db.DeleteAsync(employee);

            return new DeleteEmployeeResponse {
                Success = true,
                Message = "Employee deleted successfully"
            };
        }
            
    }
}
