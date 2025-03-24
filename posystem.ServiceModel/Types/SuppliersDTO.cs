using ServiceStack;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace posystem.ServiceModel.Types
{
    #region request/Response DTOs

    [Route("/suppliers", "GET")]

    public class GetSuppliersDTO : IReturn<GetSuppliersResponse>
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }

    public class GetSuppliersResponse
    {
        public List<SupplierListItemDTO> Suppliers { get; set; } = new List<SupplierListItemDTO>();
        public int TotalCount { get; set; }
    }

    [Route("/suppliers/{Id}", "GET")]
    public class GetSupplierDTO : IReturn<GetSupplierResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetSupplierResponse
    {
        public SupplierDetailsDTO Supplier { get; set; }
    }
    
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

    public class CreateSupplierResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public SupplierDetailsDTO Supplier { get; set; }
    }
    
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

    public class UpdateSupplierResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public SupplierDetailsDTO Supplier { get; set; }
    }
    
    [Route("/suppliers/{Id}", "DELETE")]
    public class DeleteSupplierDTO : IReturn<DeleteSupplierResponse>
    {
        public Guid Id { get; set; }
    }
    
    public class DeleteSupplierResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
    
    #endregion

    #region DTO Models

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