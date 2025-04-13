import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField,
  Button,
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
  Search as SearchIcon,

} from '@mui/icons-material';

import DiscountTable from './DiscountTable';
import DiscountForm from './DiscountForm';
import discountApi from '../../../../api/discountAPI';
import employeeApi from '../../../../api/employeeApi';

/**
 * DiscountsSection Component
 * 
 * A component for managing discounts in the bookstore system.
 * Provides functionality for:
 * - Viewing a list of discounts in a table format
 * - Adding new discounts
 * - Editing existing discounts
 * - Deleting discounts
 */
const DiscountsSection = () => {
  const [discounts, setDiscounts] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState({
    name: '',
    discountPercentage: 0,
    startDate: '',
    endDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch discounts from API
  useEffect(() => {
    fetchDiscounts();
  }, [filter]);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (filter) {
        params.searchTerm = filter;
      }

      const response = await discountApi.getDiscounts(params);
      
      if (response && response.discounts) {
        // Map API response to component state format, ensure correct property casing
        const mappedDiscounts = response.discounts.map(discount => ({
          id: discount.id,
          name: discount.discount_Name,
          discountPercentage: discount.percentage,
          startDate: formatDate(discount.start_Date),
          endDate: formatDate(discount.end_Date),
          isActive: isDiscountActive(discount.start_Date, discount.end_Date),
          employeeName: discount.name || discount.employee_Name || 'N/A',
          // Consistent handling of employee_id
          employeeId: discount.employee_id
        }));
        
        setDiscounts(mappedDiscounts);
      } else {
        console.warn('No discounts property in response:', response);
        setDiscounts([]);
      }
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
      setNotification({
        open: true,
        message: 'Failed to load discounts. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  // Check if discount is active based on dates
  const isDiscountActive = (startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    return (!start || now >= start) && (!end || now <= end);
  };

  // Handle search filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentDiscount(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate discount data
  const validateDiscount = (discount) => {
    const errors = {};
    
    if (!discount.name?.trim()) errors.name = 'Name is required';
    if (!discount.discountPercentage || isNaN(parseFloat(discount.discountPercentage)) || 
        parseFloat(discount.discountPercentage) <= 0 || parseFloat(discount.discountPercentage) > 100) {
      errors.discountPercentage = 'Valid percentage between 1-100 is required';
    }
    if (!discount.startDate) errors.startDate = 'Start date is required';
    if (!discount.endDate) errors.endDate = 'End date is required';
    
    if (discount.startDate && discount.endDate && new Date(discount.startDate) > new Date(discount.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    return errors;
  };

  // Open dialog for adding a new discount
  const handleAddDiscount = () => {
    setCurrentDiscount({
      name: '',
      discountPercentage: 0,
      startDate: '',
      endDate: ''
    });
    setIsEditing(false);
    setValidationErrors({});
    setOpenDialog(true);
  };

  // Open dialog for editing an existing discount
  const handleEditDiscount = async (discount) => {
    try {
      setLoading(true);
      // If needed, fetch complete discount details for editing
      const response = await discountApi.getDiscount(discount.id);
      
      if (response && response.discount) {
        const discountDetails = response.discount;
        
        setCurrentDiscount({
          id: discountDetails.id,
          name: discountDetails.discount_Name,
          discountPercentage: discountDetails.percentage,
          startDate: formatDate(discountDetails.start_Date),
          endDate: formatDate(discountDetails.end_Date),
          isActive: isDiscountActive(discountDetails.start_Date, discountDetails.end_Date),
          employeeId: discountDetails.employee_id,
          employeeName: discountDetails.name || discountDetails.employee_Name || 'N/A'
        });
        setIsEditing(true);
        setOpenDialog(true);
        setValidationErrors({});
      }
    } catch (error) {
      console.error('Failed to fetch discount details:', error);
      setNotification({
        open: true,
        message: 'Failed to load discount details for editing.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation dialog for deleting a discount
  const handleDeleteDiscount = (discount) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
  };

  // Confirm discount deletion
  const confirmDeleteDiscount = async () => {
    try {
      setLoading(true);
      await discountApi.deleteDiscount(discountToDelete.id);
      
      // Remove from local state
      setDiscounts(prevDiscounts => 
        prevDiscounts.filter(d => d.id !== discountToDelete.id)
      );
      
      setNotification({
        open: true,
        message: `Discount "${discountToDelete.name}" has been deleted`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to delete discount:', error);
      setNotification({
        open: true,
        message: 'Failed to delete discount. Please try again.',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  // Save new or updated discount
  const handleSaveDiscount = async () => {
    // Validate form
    const errors = validateDiscount(currentDiscount);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      
      // Map form data to API format
      const discountData = {
        percentage: parseFloat(currentDiscount.discountPercentage),
        start_Date: currentDiscount.startDate,
        end_Date: currentDiscount.endDate,
        discount_Name: currentDiscount.name,
      };
      
      // Add employee_id only for new discounts, not for updates
      if (!isEditing) {
        // Get the actual employeeId from localStorage that was saved during login
        const employeeId = localStorage.getItem('employeeId');
        
        // Log to help debug
        //console.log('Using employee ID for new discount:', employeeId);
        
        if (!employeeId) {
          // If no employee ID in localStorage, fetch a valid employee to use
          try {
            setNotification({
              open: true,
              message: 'No employee ID found in local storage. Attempting to find a valid employee...',
              severity: 'warning'
            });
            
            // Try to get a list of employees and use the first active one
            const employeesResponse = await employeeApi.getEmployees({ take: 1 });
            if (employeesResponse && employeesResponse.employees && employeesResponse.employees.length > 0) {
              const firstEmployee = employeesResponse.employees[0];
              discountData.employee_id = firstEmployee.Id;
              //console.log('Using fallback employee ID:', firstEmployee.Id);
            } else {
              setNotification({
                open: true,
                message: 'Cannot create discount: No valid employee found. Please log in again.',
                severity: 'error'
              });
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error finding a valid employee:', error);
            setNotification({
              open: true,
              message: 'Cannot create discount: Failed to find a valid employee. Please log in again.',
              severity: 'error'
            });
            setLoading(false);
            return;
          }
        } else {
          discountData.employee_id = employeeId;
        }
      }
      
      let response;
      
      if (isEditing) {
        // Update existing discount - only send id and updatable fields
        response = await discountApi.updateDiscount(currentDiscount.id, {
          id: currentDiscount.id,
          percentage: discountData.percentage,
          start_Date: discountData.start_Date,
          end_Date: discountData.end_Date,
          discount_Name: discountData.discount_Name
        });
        
        if (response && response.success) {
          // Update local state
          setDiscounts(prevDiscounts => 
            prevDiscounts.map(d => 
              d.id === currentDiscount.id 
                ? {
                    ...d,
                    name: currentDiscount.name,
                    discountPercentage: parseFloat(currentDiscount.discountPercentage),
                    startDate: currentDiscount.startDate,
                    endDate: currentDiscount.endDate,
                    isActive: isDiscountActive(currentDiscount.startDate, currentDiscount.endDate),
                    employeeName: currentDiscount.employeeName || d.employeeName
                  } 
                : d
            )
          );
          
          setNotification({
            open: true,
            message: `Discount "${currentDiscount.name}" has been updated`,
            severity: 'success'
          });
        } else {
          throw new Error(response?.message || 'Failed to update discount');
        }
      } else {
        // Add new discount
        response = await discountApi.createDiscount(discountData);
        
        if (response && response.success) {
          // Refresh the discounts list
          fetchDiscounts();
          
          setNotification({
            open: true,
            message: `Discount "${currentDiscount.name}" has been added`,
            severity: 'success'
          });
        } else {
          throw new Error(response?.message || 'Failed to create discount');
        }
      }
      
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to save discount:', error);
      setNotification({
        open: true,
        message: `Failed to ${isEditing ? 'update' : 'create'} discount: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleApplyToAll = async (discountId) => {
    try {
      const response = await discountApi.applyToAllBooks(discountId);
      if (response.success) {
        setNotification({ open: true, message: response.message, severity: 'success' });
      } else {
        setNotification({ open: true, message: response.message, severity: 'warning' });
      }
    } catch (err) {
      console.error('Failed to apply discount to all books:', err);
      setNotification({ open: true, message: 'Failed to apply discount to all books.', severity: 'error' });
    }
  };

  const handleRemoveFromAllBooks = async (discountId) => {
    try {
      const response = await discountApi.removeDiscountFromAllBooks(discountId);
      if (response.success) {
        setNotification({ open: true, message: response.message, severity: 'success' });
        fetchDiscounts(); // refresh UI
      } else {
        setNotification({ open: true, message: response.message, severity: 'warning' });
      }
    } catch (err) {
      console.error("Failed to remove discount from books:", err);
      setNotification({ open: true, message: "Error removing discount from books.", severity: 'error' });
    }
  };
  

  // Filter discounts based on search term (client-side filter as backup)
  const filteredDiscounts = discounts.filter(discount => 
    discount.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      
      {/* Search and Add Button Row */}
      <Box sx={{ display: 'flex', mb: 3, gap: 3, alignItems: 'center', justifyContent: 'center', p: 0 }}>
        <TextField
          placeholder="Search discounts..."
          variant="outlined"
          size="small"
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: '60%',
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              borderRadius: '8px',
              color: 'white',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleAddDiscount}
          sx={{
            bgcolor: '#61677A',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#4F5461'
            },
            borderRadius: '8px',
            px: 2.5,
            py: 0.75
          }}
        >
          ADD DISCOUNT
        </Button>
      </Box>
      
      {/* Discounts Table with Loading State */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DiscountTable 
          discounts={filteredDiscounts}
          onEdit={handleEditDiscount}
          onDelete={handleDeleteDiscount}
        />
      )}
      
      {/* Add/Edit Discount Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#1E1E1E',
            color: 'white'
          }
        }}
      >
        <DialogTitle>{isEditing ? 'Edit Discount' : 'Add New Discount'}</DialogTitle>
        <DialogContent>
        <DiscountForm 
          discount={currentDiscount}
          handleInputChange={handleInputChange}
          validationErrors={validationErrors}
          onApplyToAll={handleApplyToAll}
          onRemoveFromAll={handleRemoveFromAllBooks}
        />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDiscount} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1E1E1E',
            color: 'white'
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Delete discount &quot;{discountToDelete?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'white' }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteDiscount} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={5000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscountsSection; 