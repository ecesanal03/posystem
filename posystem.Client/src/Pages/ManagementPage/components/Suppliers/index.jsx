import { useState } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';

import SupplierForm from './SupplierForm';
import SupplierTable from './SupplierTable';

const SuppliersSection = () => {
  // Suppliers data state
  const [suppliers, setSuppliers] = useState([
    { 
      id: 1, 
      name: 'Penguin Random House', 
      contact_person: 'Jennifer Miller', 
      email: 'jmiller@prh.com', 
      phone: '212-782-9000', 
      address: '1745 Broadway',
      city: 'New York', 
      state: 'NY',
      zip: '10019',
      country: 'USA',
      added_at: new Date('2023-10-15')
    },
    { 
      id: 2, 
      name: 'HarperCollins Publishers', 
      contact_person: 'Michael Roberts', 
      email: 'mroberts@harpercollins.com', 
      phone: '212-207-7000', 
      address: '195 Broadway',
      city: 'New York', 
      state: 'NY',
      zip: '10007',
      country: 'USA',
      added_at: new Date('2023-11-22')
    },
    { 
      id: 3, 
      name: 'Scholastic Corporation', 
      contact_person: 'Sarah Johnson', 
      email: 'sjohnson@scholastic.com', 
      phone: '800-724-6527', 
      address: '557 Broadway',
      city: 'New York', 
      state: 'NY',
      zip: '10012',
      country: 'USA',
      added_at: new Date('2024-01-08')
    },
  ]);
  
  // Form state
  const [supplierFilter, setSupplierFilter] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  // UI state
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [supplierValidationErrors, setSupplierValidationErrors] = useState({});
  const [deleteSupplierDialogOpen, setDeleteSupplierDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [isEditingSupplier, setIsEditingSupplier] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  const handleSupplierFilterChange = (e) => {
    setSupplierFilter(e.target.value);
  };

  const handleNewSupplierChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const validateSupplier = (supplier) => {
    const errors = {};
    
    if (!supplier.name.trim()) errors.name = 'Name is required';
    if (!supplier.contact_person.trim()) errors.contact_person = 'Contact person is required';
    if (!supplier.email.trim()) errors.email = 'Email is required';
    if (!supplier.phone.trim()) errors.phone = 'Phone is required';
    if (!supplier.address.trim()) errors.address = 'Address is required';
    if (!supplier.city.trim()) errors.city = 'City is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (supplier.email && !emailRegex.test(supplier.email)) {
      errors.email = 'Valid email is required';
    }
    
    return errors;
  };

  const handleEditSupplier = (supplier) => {
    setSupplierToEdit(supplier);
    setNewSupplier({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      state: supplier.state || '',
      zip: supplier.zip || '',
      country: supplier.country || ''
    });
    setIsEditingSupplier(true);
    setShowAddSupplierForm(true);
    setSupplierValidationErrors({});
  };

  const handleDeleteSupplier = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteSupplierDialogOpen(true);
  };

  const confirmDeleteSupplier = () => {
    if (supplierToDelete) {
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== supplierToDelete.id));
      setDeleteSupplierDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  const handleSupplierCancel = () => {
    setShowAddSupplierForm(false);
    setIsEditingSupplier(false);
    setSupplierToEdit(null);
    setNewSupplier({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    });
    setSupplierValidationErrors({});
  };

  const addSupplier = () => {
    if (showAddSupplierForm) {
      // Validate required fields
      const errors = validateSupplier(newSupplier);
      setSupplierValidationErrors(errors);
      
      // If there are validation errors, don't add/update the supplier
      if (Object.keys(errors).length > 0) {
        return;
      }
      
      // All validation passed, add or update the supplier
      if (isEditingSupplier && supplierToEdit) {
        // Update existing supplier
        const updatedSupplier = {
          ...supplierToEdit,
          name: newSupplier.name,
          contact_person: newSupplier.contact_person,
          email: newSupplier.email,
          phone: newSupplier.phone,
          address: newSupplier.address,
          city: newSupplier.city,
          state: newSupplier.state,
          zip: newSupplier.zip,
          country: newSupplier.country,
          updated_at: new Date()
        };
        
        setSuppliers((prev) => prev.map((supplier) => 
          supplier.id === supplierToEdit.id ? updatedSupplier : supplier
        ));
        setIsEditingSupplier(false);
        setSupplierToEdit(null);
      } else {
        // Add new supplier
        const supplierToAdd = {
          id: suppliers.length + 1,
          name: newSupplier.name,
          contact_person: newSupplier.contact_person,
          email: newSupplier.email,
          phone: newSupplier.phone,
          address: newSupplier.address,
          city: newSupplier.city,
          state: newSupplier.state,
          zip: newSupplier.zip,
          country: newSupplier.country,
          added_at: new Date()
        };
        
        setSuppliers((prev) => [...prev, supplierToAdd]);
      }
      
      // Reset form
      setNewSupplier({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      });
      setSupplierValidationErrors({});
      setShowAddSupplierForm(false);
    } else {
      // Show the form for adding a new supplier
      setIsEditingSupplier(false);
      setSupplierToEdit(null);
      setShowAddSupplierForm(true);
      setSupplierValidationErrors({});
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(supplierFilter.toLowerCase()) ||
    (supplier.contact_person && supplier.contact_person.toLowerCase().includes(supplierFilter.toLowerCase())) ||
    (supplier.email && supplier.email.toLowerCase().includes(supplierFilter.toLowerCase())) ||
    (supplier.country && supplier.country.toLowerCase().includes(supplierFilter.toLowerCase()))
  );

  return (
    <Box sx={{ p: 2 }}> 
      {/* Supplier Add Form */}
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
              onClick={addSupplier}
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
              {isEditingSupplier ? 'UPDATE SUPPLIER' : 'ADD SUPPLIER'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Supplier Table - Using the SupplierTable component */}
      <SupplierTable 
        suppliers={filteredSuppliers} 
        onEdit={handleEditSupplier} 
        onDelete={handleDeleteSupplier} 
      />

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
            Deleting &ldquo;{supplierToDelete?.name}&rdquo; cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteSupplierDialogOpen(false)}
            sx={{
              color: '#D8D9DA',
              '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteSupplier}
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersSection; 