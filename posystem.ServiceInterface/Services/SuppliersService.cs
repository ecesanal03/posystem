using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using posystem.ServiceModel;
using posystem.ServiceModel.Types;
using posystem.ServiceModel.Models;

namespace posystem.ServiceInterface.Services
{
    /// <summary>
    /// Service responsible for handling all supplier-related operations in the system.
    /// This includes CRUD operations (Create, Read, Update, Delete) for suppliers.
    /// Uses ServiceStack's ORM Lite for database operations.
    /// </summary>
    public class SuppliersService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        /// <summary>
        /// Initializes a new instance of the SuppliersService.
        /// </summary>
        /// <param name="dbConnectionFactory">Database connection factory for ORM operations</param>
        public SuppliersService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        /// <summary>
        /// Retrieves a list of suppliers with optional filtering, sorting, and pagination.
        /// </summary>
        /// <param name="request">GetSuppliersDTO containing search parameters, sorting options, and pagination settings</param>
        /// <returns>GetSuppliersResponse containing the list of suppliers and total count</returns>
        public async Task<GetSuppliersResponse> Get(GetSuppliersDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var query = db.From<Suppliers>();

            if(!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(s => 
                s.SupplierName.Contains(request.SearchTerm) ||
                s.Email.Contains(request.SearchTerm) ||
                s.PhoneNumber.Contains(request.SearchTerm) ||
                s.AddressLineOne.Contains(request.SearchTerm) ||
                s.City.Contains(request.SearchTerm) ||
                s.State.Contains(request.SearchTerm) ||
                s.ZipCode.Contains(request.SearchTerm) ||
                s.Country.Contains(request.SearchTerm));
            }

            if(!string.IsNullOrEmpty(request.SortBy))
            {
                query = request.SortDesc
                    ? query.OrderByDescending(request.SortBy)
                    : query.OrderBy(request.SortBy);
            } else {
                query = query.OrderByDescending(s => s.Added_At);
            }

            var totalCount = await db.CountAsync(query);

            if(request.Skip > 0)
            {
                query = query.Skip(request.Skip);
            }

            if(request.Take > 0)
            {
                query = query.Take(request.Take);
            }

            var suppliers = await db.SelectAsync(query);

            var supplierDtos = suppliers.Select(s => new SupplierListItemDTO
            {
                Id = s.Id,
                SupplierName = s.SupplierName,
                Email = s.Email,
                PhoneNumber = s.PhoneNumber,
                AddressLineOne = s.AddressLineOne,
                AddressLineTwo = s.AddressLineTwo,
                City = s.City,
                State = s.State,
                ZipCode = s.ZipCode,
                Country = s.Country,
                Added_At = s.Added_At
            }).ToList();

            return new GetSuppliersResponse
            {
                Suppliers = supplierDtos,
                TotalCount = (int)totalCount
            };
        }

        /// <summary>
        /// Retrieves a single supplier by their ID.
        /// </summary>
        /// <param name="request">GetSupplierDTO containing the supplier ID</param>
        /// <returns>GetSupplierResponse containing the detailed supplier information</returns>
        /// <exception cref="HttpError">Throws 404 if supplier is not found</exception>
        public async Task<GetSupplierResponse> Get(GetSupplierDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var supplier = await db.SingleByIdAsync<Suppliers>(request.Id);

            if(supplier == null)
                throw HttpError.NotFound("Supplier not found");

            var supplierDto = new SupplierDetailsDTO
            {
                Id = supplier.Id,
                SupplierName = supplier.SupplierName,
                Email = supplier.Email,
                PhoneNumber = supplier.PhoneNumber,
                AddressLineOne = supplier.AddressLineOne,
                AddressLineTwo = supplier.AddressLineTwo,
                City = supplier.City,
                State = supplier.State,
                ZipCode = supplier.ZipCode,
                Country = supplier.Country,
                Added_At = supplier.Added_At
            };

            return new GetSupplierResponse { Supplier = supplierDto };
        }

        /// <summary>
        /// Creates a new supplier in the system.
        /// Validates phone number uniqueness before creation.
        /// </summary>
        /// <param name="request">CreateSupplierDTO containing the new supplier's information</param>
        /// <returns>CreateSupplierResponse indicating success/failure and containing the created supplier</returns>
        public async Task<CreateSupplierResponse> Post(CreateSupplierDTO request)
        {
            try
            {
                using var db = _dbConnectionFactory.OpenDbConnection();
                
                if(!string.IsNullOrEmpty(request.PhoneNumber))
                {
                    var existingSupplier = await db.SingleAsync<Suppliers>(s => s.PhoneNumber == request.PhoneNumber);
                    
                    if(existingSupplier != null)
                    {
                        return new CreateSupplierResponse
                        {
                            Success = false,
                            Message = "Phone number already exists"
                        };
                    }
                }

                var newSupplier = new Suppliers
                {
                    Id = Guid.NewGuid(),
                    SupplierName = request.SupplierName,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    AddressLineOne = request.AddressLineOne,
                    AddressLineTwo = request.AddressLineTwo,
                    City = request.City,
                    State = request.State,
                    ZipCode = request.ZipCode,
                    Country = request.Country,
                    Added_At = DateTime.UtcNow
                };

                await db.SaveAsync(newSupplier);

                var createdSupplier = await db.SingleByIdAsync<Suppliers>(newSupplier.Id);
                
                var supplierDto = new SupplierDetailsDTO
                {
                    Id = createdSupplier.Id,
                    SupplierName = createdSupplier.SupplierName,
                    Email = createdSupplier.Email,
                    PhoneNumber = createdSupplier.PhoneNumber,
                    AddressLineOne = createdSupplier.AddressLineOne,
                    AddressLineTwo = createdSupplier.AddressLineTwo,
                    City = createdSupplier.City,
                    State = createdSupplier.State,
                    ZipCode = createdSupplier.ZipCode,
                    Country = createdSupplier.Country,
                    Added_At = createdSupplier.Added_At
                };

                return new CreateSupplierResponse
                {
                    Success = true,
                    Message = "Supplier created successfully",
                    Supplier = supplierDto
                };
            }
            catch (Exception ex)
            {
                return new CreateSupplierResponse
                {
                    Success = false,
                    Message = $"Error creating supplier: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Updates an existing supplier's information.
        /// Validates phone number uniqueness if being changed.
        /// </summary>
        /// <param name="request">UpdateSupplierDTO containing the updated supplier information</param>
        /// <returns>UpdateSupplierResponse indicating success/failure and containing the updated supplier</returns>
        public async Task<UpdateSupplierResponse> Put(UpdateSupplierDTO request)
        {
            try
            {
                using var db = _dbConnectionFactory.OpenDbConnection();

                var existingSupplier = await db.SingleByIdAsync<Suppliers>(request.Id);
                
                if(existingSupplier == null)
                {
                    return new UpdateSupplierResponse
                    {
                        Success = false,
                        Message = "Supplier not found"
                    };
                }

                if(!string.IsNullOrEmpty(request.PhoneNumber) && 
                    request.PhoneNumber != existingSupplier.PhoneNumber)
                {
                    var supplierWithSamePhone = await db.SingleAsync<Suppliers>(s => 
                        s.PhoneNumber == request.PhoneNumber && s.Id != request.Id);
                    
                    if(supplierWithSamePhone != null)
                    {
                        return new UpdateSupplierResponse
                        {
                            Success = false,
                            Message = $"Phone number {request.PhoneNumber} already exists"
                        };
                    }
                }

                existingSupplier.SupplierName = request.SupplierName;
                existingSupplier.Email = request.Email;
                existingSupplier.PhoneNumber = request.PhoneNumber;
                existingSupplier.AddressLineOne = request.AddressLineOne;
                existingSupplier.AddressLineTwo = request.AddressLineTwo;
                existingSupplier.City = request.City;
                existingSupplier.State = request.State;
                existingSupplier.ZipCode = request.ZipCode;
                existingSupplier.Country = request.Country;

                await db.UpdateAsync(existingSupplier);
                
                var updatedSupplier = await db.SingleByIdAsync<Suppliers>(existingSupplier.Id);

                var supplierDto = new SupplierDetailsDTO
                {
                    Id = updatedSupplier.Id,
                    SupplierName = updatedSupplier.SupplierName,
                    Email = updatedSupplier.Email,
                    PhoneNumber = updatedSupplier.PhoneNumber,
                    AddressLineOne = updatedSupplier.AddressLineOne,
                    AddressLineTwo = updatedSupplier.AddressLineTwo,
                    City = updatedSupplier.City,
                    State = updatedSupplier.State,
                    ZipCode = updatedSupplier.ZipCode,
                    Country = updatedSupplier.Country,
                    Added_At = updatedSupplier.Added_At
                };

                return new UpdateSupplierResponse
                {
                    Success = true,
                    Message = "Supplier updated successfully",
                    Supplier = supplierDto
                };
            }
            catch (Exception ex)
            {
                return new UpdateSupplierResponse
                {
                    Success = false,
                    Message = $"Error updating supplier: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Deletes a supplier from the system.
        /// </summary>
        /// <param name="request">DeleteSupplierDTO containing the ID of the supplier to delete</param>
        /// <returns>DeleteSupplierResponse indicating success/failure of the deletion</returns>
        public async Task<DeleteSupplierResponse> Delete(DeleteSupplierDTO request)
        {
            try
            {
                using var db = _dbConnectionFactory.OpenDbConnection();

                var existingSupplier = await db.SingleByIdAsync<Suppliers>(request.Id);
                
                if(existingSupplier == null)
                {
                    return new DeleteSupplierResponse
                    {
                        Success = false,
                        Message = "Supplier not found"
                    };
                }

                await db.DeleteByIdAsync<Suppliers>(request.Id);

                return new DeleteSupplierResponse
                {
                    Success = true,
                    Message = "Supplier deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new DeleteSupplierResponse
                {
                    Success = false,
                    Message = $"Error deleting supplier: {ex.Message}"
                };
            }
        }
    }
}