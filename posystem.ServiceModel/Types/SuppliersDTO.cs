using ServiceStack;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace posystem.ServiceModel.Types
{
    #region request/Response DTOs

    /// <summary>
    /// DTO for retrieving a list of suppliers with filtering, sorting, and pagination options.
    /// Maps to GET /suppliers endpoint.
    /// </summary>
    [Route("/suppliers", "GET")]
    public class GetSuppliersDTO : IReturn<GetSuppliersResponse>
    {

        /// Optional search term to filter suppliers by name, email, phone, address, etc.

        public string? SearchTerm { get; set; }


        /// Field name to sort results by

        public string? SortBy { get; set; }


        /// Whether to sort in descending order

        public bool SortDesc { get; set; }


        /// Number of records to skip for pagination

        public int Skip { get; set; }


        /// Number of records to take per page

        public int Take { get; set; }
    }


    /// Response DTO containing the list of suppliers and total count for pagination.

    public class GetSuppliersResponse
    {
        public List<SupplierListItemDTO> Suppliers { get; set; } = new List<SupplierListItemDTO>();
        public int TotalCount { get; set; }
    }

    /// <summary>
    /// DTO for retrieving a single supplier by ID.
    /// Maps to GET /suppliers/{Id} endpoint.
    [Route("/suppliers/{Id}", "GET")]
    public class GetSupplierDTO : IReturn<GetSupplierResponse>
    {
        public Guid Id { get; set; }
    }

    /// Response DTO containing detailed information about a single supplier.
    public class GetSupplierResponse
    {
        public SupplierDetailsDTO Supplier { get; set; }
    }
    
    /// <summary>
    /// DTO for creating a new supplier.
    /// Maps to POST /suppliers endpoint.
    [Route("/suppliers", "POST")]
    public class CreateSupplierDTO : IReturn<CreateSupplierResponse>
    {
        public string SupplierName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
    }

    /// Response DTO indicating success/failure of supplier creation and containing the created supplier.
    public class CreateSupplierResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public SupplierDetailsDTO Supplier { get; set; }
    }
    
    /// <summary>
    /// DTO for updating an existing supplier.
    /// Maps to PUT /suppliers/{Id} endpoint.
    [Route("/suppliers/{Id}", "PUT")]
    public class UpdateSupplierDTO : IReturn<UpdateSupplierResponse>
    {
        public Guid Id { get; set; }
        public string SupplierName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
    }

    /// Response DTO indicating success/failure of supplier update and containing the updated supplier.
    public class UpdateSupplierResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public SupplierDetailsDTO Supplier { get; set; }
    }
    
    /// <summary>
    /// DTO for deleting a supplier.
    /// Maps to DELETE /suppliers/{Id} endpoint.
    [Route("/suppliers/{Id}", "DELETE")]
    public class DeleteSupplierDTO : IReturn<DeleteSupplierResponse>
    {
        public Guid Id { get; set; }
    }
    
    /// Response DTO indicating success/failure of supplier deletion.
    public class DeleteSupplierResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
    
    #endregion

    #region DTO Models

    /// <summary>
    /// DTO for displaying suppliers in list views (e.g., tables, grids).
    /// Contains all supplier information needed for display in lists.
    public class SupplierListItemDTO
    {
        public Guid Id { get; set; }
        public string SupplierName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public DateTime Added_At { get; set; }
    }
    
    /// <summary>
    /// DTO for detailed supplier information, used in edit forms and detailed views.
    /// Contains all supplier properties including optional fields and metadata.
    public class SupplierDetailsDTO
    {
        public Guid Id { get; set; }
        public string SupplierName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public DateTime Added_At { get; set; }
    }
}
    #endregion