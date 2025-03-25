import { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  TextField,
  Button,
  Paper,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';

import SupplierForm from './SupplierForm';
import SupplierTable from './SupplierTable';
import supplierApi from '../../../../api/supplierAPI';

/**
 * Helper function to format or validate GUIDs.
 * Handles different GUID formats and validates their structure.
 * 
 * @param {string} guidString - The GUID string to format/validate
 * @returns {string|null} Formatted GUID or null if invalid
 */
const formatGuid = (guidString) => {
  if (!guidString || typeof guidString !== 'string' || !guidString.trim()) {
    return null;
  }
  
  // Check if the string is already in GUID format
  const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (guidPattern.test(guidString.trim())) {
    return guidString.trim();
  }
  
  // Remove any non-hex characters
  const cleanedString = guidString.replace(/[^0-9a-f]/gi, '').toLowerCase();
  
  // Check if we have 32 hex characters (GUID without dashes)
  if (cleanedString.length !== 32) {
    return null;
  }
  
  // Format as a standard GUID
  return `${cleanedString.slice(0, 8)}-${cleanedString.slice(8, 12)}-${cleanedString.slice(12, 16)}-${cleanedString.slice(16, 20)}-${cleanedString.slice(20)}`;
};

/**
 * SuppliersSection Component
 * 
 * A comprehensive component for managing suppliers in the system.
 * Provides functionality for:
 * - Viewing a list of suppliers in a table format
 * - Searching/filtering suppliers
 * - Adding new suppliers
 * - Editing existing suppliers
 * - Deleting suppliers
 * - Handling loading states and error messages
 * 
 * The component uses Material-UI for styling and includes:
 * - A search bar for filtering suppliers
 * - A form for adding/editing suppliers
 * - A table displaying supplier information
 * - Confirmation dialogs for destructive actions
 * - Snackbar notifications for operation feedback
 */
const SuppliersSection = () => {
  // State management for suppliers data
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setTotalCount] = useState(0);
  
  // Form state management
  const [supplierFilter, setSupplierFilter] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    SupplierName: '',
    Email: '',
    PhoneNumber: '',
    AddressLineOne: '',
    AddressLineTwo: '',
    City: '',
    State: '',
    ZipCode: '',
    Country: ''
  });

  // UI state management
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [supplierValidationErrors, setSupplierValidationErrors] = useState({});
  const [deleteSupplierDialogOpen, setDeleteSupplierDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [isEditingSupplier, setIsEditingSupplier] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  /**
   * Memoized filtered suppliers list based on search term.
   * Filters suppliers by name, email, phone, address, city, state, or country.
   */
  const filteredSuppliers = useMemo(() => {
    if (!supplierFilter) return suppliers;
    
    const searchTerm = supplierFilter.toLowerCase();
    return suppliers.filter(supplier => 
      (supplier.supplierName?.toLowerCase() || '').includes(searchTerm) ||
      (supplier.email?.toLowerCase() || '').includes(searchTerm) ||
      (supplier.phoneNumber?.toLowerCase() || '').includes(searchTerm) ||
      (supplier.addressLineOne?.toLowerCase() || '').includes(searchTerm) ||
      (supplier.city?.toLowerCase() || '').includes(searchTerm) ||
      (supplier.state?.toLowerCase() || '').includes(searchTerm) ||
      (supplier.country?.toLowerCase() || '').includes(searchTerm)
    );
  }, [suppliers, supplierFilter]);

  /**
   * Effect hook to fetch suppliers when component mounts or filter changes.
   */
  useEffect(() => {
    fetchSuppliers();
  }, [supplierFilter]);

  /**
   * Fetches suppliers from the API with optional filtering.
   * Updates the suppliers state and handles loading/error states.
   */
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (supplierFilter) {
        params.searchTerm = supplierFilter;
      }

      const response = await supplierApi.getSuppliers(params);

      if (response.suppliers) {
        setSuppliers(response.suppliers);
        setTotalCount(response.totalCount);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      setError('Failed to load suppliers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles changes to the search filter input.
   * @param {Event} e - The change event
   */
  const handleSupplierFilterChange = (e) => {
    setSupplierFilter(e.target.value);
  };

  /**
   * Handles changes to the new supplier form fields.
   * @param {Event} e - The change event
   */
  const handleNewSupplierChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validates supplier data before submission.
   * Checks required fields and email format.
   * @param {Object} supplier - The supplier data to validate
   * @returns {Object} Validation errors if any
   */
  const validateSupplier = (supplier) => {
    const errors = {};
    
    if (!supplier.SupplierName?.trim()) errors.SupplierName = 'Name is required';
    if (!supplier.Email?.trim()) errors.Email = 'Email is required';
    if (!supplier.PhoneNumber?.trim()) errors.PhoneNumber = 'Phone is required';
    if (!supplier.AddressLineOne?.trim()) errors.AddressLineOne = 'Address is required';
    if (!supplier.City?.trim()) errors.City = 'City is required';
    if (!supplier.State?.trim()) errors.State = 'State is required';
    if (!supplier.ZipCode?.trim()) errors.ZipCode = 'Zip code is required';
    if (!supplier.Country?.trim()) errors.Country = 'Country is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (supplier.Email && !emailRegex.test(supplier.Email)) {
      errors.Email = 'Valid email is required';
    }
    
    // Validate any IDs in case we need to add Supplier_Id in the future
    if (supplier.Id && !formatGuid(supplier.Id)) {
      errors.Id = 'Valid GUID format required';
    }
    
    return errors;
  };

  /**
   * Handles editing an existing supplier.
   * Fetches complete supplier details and populates the form.
   * @param {Object} supplier - The supplier to edit
   */
  const handleEditSupplier = async (supplier) => {
    try {
      setLoading(true);
      const response = await supplierApi.getSupplier(supplier.id);

      if (response && response.supplier) {
        const supplierDetails = response.supplier;

        setSupplierToEdit(supplierDetails);
        setNewSupplier({
          SupplierName: supplierDetails.supplierName,
          Email: supplierDetails.email,
          PhoneNumber: supplierDetails.phoneNumber || '',
          AddressLineOne: supplierDetails.addressLineOne,
          AddressLineTwo: supplierDetails.addressLineTwo || '',
          City: supplierDetails.city,
          State: supplierDetails.state,
          ZipCode: supplierDetails.zipCode,
          Country: supplierDetails.country
        });
        setIsEditingSupplier(true);
        setShowAddSupplierForm(true);
        setSupplierValidationErrors({});
      }
    } catch (err) {
      console.error('Failed to fetch supplier details:', err);
      setNotification({
        open: true,
        message: 'Failed to load supplier details for editing.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates the supplier deletion process.
   * Opens confirmation dialog.
   * @param {Object} supplier - The supplier to delete
   */
  const handleDeleteSupplier = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteSupplierDialogOpen(true);
  };

  /**
   * Confirms and executes supplier deletion.
   * Handles success/error states and updates UI.
   */
  const confirmDeleteSupplier = async () => {
    if (supplierToDelete) {
      try {
        setLoading(true);
        const response = await supplierApi.deleteSupplier(supplierToDelete.id);

        if (response && response.success) {
          setNotification({
            open: true,
            message: 'Supplier deleted successfully',
            severity: 'success'
          });
          // Refresh the supplier list
          fetchSuppliers();
        } else {
          setNotification({
            open: true,
            message: response.message || 'Failed to delete supplier',
            severity: 'error'
          });
        }
      } catch (err) {
        console.error('Failed to delete supplier:', err);
        setNotification({
          open: true,
          message: 'Failed to delete supplier. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
        setDeleteSupplierDialogOpen(false);
        setSupplierToDelete(null);
      }
    }
  };

  /**
   * Cancels the current form operation.
   * Resets form state and validation errors.
   */
  const handleSupplierCancel = () => {
    setShowAddSupplierForm(false);
    setIsEditingSupplier(false);
    setSupplierToEdit(null);
    setNewSupplier({
      SupplierName: '',
      Email: '',
      PhoneNumber: '',
      AddressLineOne: '',
      AddressLineTwo: '',
      City: '',
      State: '',
      ZipCode: '',
      Country: ''
    });
    setSupplierValidationErrors({});
  };

  /**
   * Handles adding a new supplier or updating an existing one.
   * Validates data, makes API call, and handles response.
   */
  const handleAddOrUpdateSupplier = async () => {
    if (showAddSupplierForm) {
      // Validate required fields
      const errors = validateSupplier(newSupplier);
      setSupplierValidationErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        return;
      }
      
      try {
        setLoading(true);
        
        if (isEditingSupplier && supplierToEdit) {
          // Update existing supplier via API
          const updateRequest = {
            Id: supplierToEdit.id,
            SupplierName: newSupplier.SupplierName,
            Email: newSupplier.Email,
            PhoneNumber: newSupplier.PhoneNumber,
            AddressLineOne: newSupplier.AddressLineOne,
            AddressLineTwo: newSupplier.AddressLineTwo,
            City: newSupplier.City,
            State: newSupplier.State,
            ZipCode: newSupplier.ZipCode,
            Country: newSupplier.Country
          };
          
          const response = await supplierApi.updateSupplier(updateRequest);
          
          if (response && response.success) {
            setNotification({
              open: true,
              message: 'Supplier updated successfully',
              severity: 'success'
            });
          } else {
            setNotification({
              open: true,
              message: response.message || 'Failed to update supplier',
              severity: 'error'
            });
          }
        } else {
          // Add new supplier via API
          const createRequest = {
            SupplierName: newSupplier.SupplierName,
            Email: newSupplier.Email,
            PhoneNumber: newSupplier.PhoneNumber,
            AddressLineOne: newSupplier.AddressLineOne,
            AddressLineTwo: newSupplier.AddressLineTwo,
            City: newSupplier.City,
            State: newSupplier.State,
            ZipCode: newSupplier.ZipCode,
            Country: newSupplier.Country
          };
          
          const response = await supplierApi.createSupplier(createRequest);
          
          if (response && response.success) {
            setNotification({
              open: true,
              message: 'Supplier added successfully',
              severity: 'success'
            });
          } else {
            setNotification({
              open: true,
              message: response.message || 'Failed to add supplier',
              severity: 'error'
            });
          }
        }
        
        // Refresh supplier list to get updated data
        fetchSuppliers();
        
        // Reset form
        setNewSupplier({
          SupplierName: '',
          Email: '',
          PhoneNumber: '',
          AddressLineOne: '',
          AddressLineTwo: '',
          City: '',
          State: '',
          ZipCode: '',
          Country: ''
        });
        setSupplierValidationErrors({});
        setShowAddSupplierForm(false);
        setIsEditingSupplier(false);
        setSupplierToEdit(null);
      } catch (err) {
        console.error('Error saving supplier:', err);
        setNotification({
          open: true,
          message: `Error saving supplier: ${err.message || 'Unknown error'}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Show the form for adding a new supplier
      setIsEditingSupplier(false);
      setSupplierToEdit(null);
      setShowAddSupplierForm(true);
      setSupplierValidationErrors({});
    }
  };

  /**
   * Closes the notification snackbar.
   */
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 2 }}> 
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Supplier Add/Edit Form */}
      {showAddSupplierForm && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: '#1E201E',
          borderRadius: 1
        }}>
          <SupplierForm 
            newSupplier={newSupplier}
            handleNewSupplierChange={handleNewSupplierChange}
            supplierValidationErrors={supplierValidationErrors}
          />
        </Paper>
      )}

      {/* Search controls and Table */}
      <Paper elevation={0} sx={{ mb: 3, bgcolor: '#1E201E' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            p: 0
          }}
        >
          <TextField
            placeholder="Search Suppliers"
            size="small"
            value={supplierFilter}
            onChange={handleSupplierFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              style: { color: 'white' }
            }}
            sx={{ 
              width: '60%',
              '& .MuiOutlinedInput-root': {
                bgcolor: '#2A2D2A',
                borderRadius: 1,
                borderColor: '#61677A',
                color: 'white'
              },
              '& .MuiOutlinedInput-input': {
                color: 'white'
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: 0, ml: 2 }}>
            {showAddSupplierForm && (
              <Button
                variant="outlined"
                size="medium"
                onClick={handleSupplierCancel}
                disabled={loading}
                sx={{ 
                  minWidth: 100,
                  borderColor: '#61677A',
                  color: '#D8D9DA',
                  '&:hover': {
                    borderColor: '#6D7386',
                    bgcolor: 'rgba(109, 115, 134, 0.1)'
                  }
                }}
              >
                CANCEL
              </Button>
            )}
            <Button
              variant="contained"
              size="medium"
              onClick={handleAddOrUpdateSupplier}
              disabled={loading}
              sx={{ 
                minWidth: 140,
                bgcolor: '#61677A',
                color: 'white',
                '&:hover': {
                  bgcolor: '#6D7386'
                },
                ml: 2
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isEditingSupplier ? 'UPDATE SUPPLIER' : 'ADD SUPPLIER'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Loading state */}
      {loading && !showAddSupplierForm && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Supplier Table */}
      {!loading && !error && (
        <SupplierTable 
          suppliers={filteredSuppliers} 
          onEdit={handleEditSupplier} 
          onDelete={handleDeleteSupplier} 
        />
      )}

      {/* Delete Supplier Confirmation Dialog */}
      <Dialog
        open={deleteSupplierDialogOpen}
        onClose={() => setDeleteSupplierDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2A2D2A',
            color: '#D8D9DA',
            borderRadius: 1,
            border: '1px solid #61677A'
          }
        }}
      >
        <DialogTitle>Are You Sure?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#D8D9DA' }}>
            Deleting &ldquo;{supplierToDelete?.supplierName}&rdquo; cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteSupplierDialogOpen(false)}
            disabled={loading}
            sx={{
              color: '#D8D9DA',
              '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteSupplier}
            disabled={loading}
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersSection; 