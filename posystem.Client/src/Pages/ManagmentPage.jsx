import { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar,
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  CssBaseline, 
  IconButton,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Tune as TuneIcon,
  UploadFile as UploadFileIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import Inter font
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

const drawerWidth = 240;

// Create a custom theme with Inter font
const theme = createTheme({
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: 14,
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#61677A', // Same color as sidebar dividers
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6D7386', // Slightly lighter on hover
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6D7386', // Slightly lighter when focused
            }
          },
          input: {
            color: '#D8D9DA' // Text color in inputs
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#9EA4AD', // Slightly muted label color
            '&.Mui-focused': {
              color: '#D8D9DA' // Brighter when focused
            }
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: '#61677A',
            color: '#D8D9DA',
            fontSize: '14px'
          },
          head: {
            fontWeight: 500,
            color: '#ffffff'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderColor: '#61677A',
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: '#61677A'
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: '14px',
            fontWeight: 500,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            paddingTop: '10px',
            paddingBottom: '10px',
          },
        },
      },
    },
  });

function ManagmentPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('Dashboard');
    const [books, setBooks] = useState([
        { id: 1, title: 'Book One', author: 'Author A', distributor: 'Distributor A', price: 19.99, units: 25 },
        { id: 2, title: 'Book Two', author: 'Author B', distributor: 'Distributor B', price: 24.99, units: 15 },
        { id: 3, title: 'Book Three', author: 'Author C', distributor: 'Distributor A', price: 14.99, units: 30 },
    ]);
    const [filter, setFilter] = useState('');
    const [newBook, setNewBook] = useState({ 
        title: '', 
        author: '', 
        distributor: '', 
        price: '', 
        units: '', 
        description: '', 
        isbn: '',
        supplier_id: '',
        discount_id: '',
        image: null 
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isEditingBook, setIsEditingBook] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null);

    // Suppliers state
    const [suppliers, setSuppliers] = useState([
        { id: 1, name: 'Supplier A', contact_person: 'John Doe', email: 'john@suppliera.com', phone: '555-1234', address: '123 Main St', added_at: new Date('2023-01-15') },
        { id: 2, name: 'Supplier B', contact_person: 'Jane Smith', email: 'jane@supplierb.com', phone: '555-5678', address: '456 Oak Ave', added_at: new Date('2023-02-20') },
    ]);
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
        country: '',

    });
    const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
    const [supplierValidationErrors, setSupplierValidationErrors] = useState({});
    const [deleteSupplierDialogOpen, setDeleteSupplierDialogOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [isEditingSupplier, setIsEditingSupplier] = useState(false);
    const [supplierToEdit, setSupplierToEdit] = useState(null);

    // Orders state
    const [orders, setOrders] = useState([
        { 
            id: 1, 
            customer_id: 'CUST001', 
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            customer_phone: '555-1234',
            customer_address: '123 Main St, Anytown, TX 75001',
            order_date: new Date('2023-05-15'),
            delivery_date: new Date('2023-05-18'),
            order_status: 'Delivered',
            total_amount: 64.97,
            items: [
                { book_id: 1, title: 'Book One', quantity: 2, price: 19.99 },
                { book_id: 3, title: 'Book Three', quantity: 1, price: 14.99 },
                { book_id: 2, title: 'Book Two', quantity: 1, price: 9.99 }
            ]
        },
        { 
            id: 2, 
            customer_id: 'CUST002', 
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            customer_phone: '555-5678',
            customer_address: '456 Oak Ave, Somewhere, CA 90210',
            order_date: new Date('2023-06-10'),
            delivery_date: new Date('2023-06-14'),
            order_status: 'Processing',
            total_amount: 34.98,
            items: [
                { book_id: 2, title: 'Book Two', quantity: 1, price: 24.99 },
                { book_id: 3, title: 'Book Three', quantity: 1, price: 9.99 }
            ]
        }
    ]);
    const [orderFilter, setOrderFilter] = useState('');
    const [deleteOrderDialogOpen, setDeleteOrderDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [orderDetailOpen, setOrderDetailOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderStatusOptions] = useState([
        'Processing', 'Shipped', 'Delivered', 'Cancelled'
    ]);

    // Sample navigation items
    const navigation = [
        { name: 'Dashboard'},
        { name: 'Books'},
        { name: 'Suppliers'},
        { name: 'Orders'},
        { name: 'Reports'},
        { name: 'Settings'},
    ];

    const handleNavigation = (section) => {
        setActiveSection(section);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleNewBookChange = (e) => {
        const { name, value } = e.target;
        setNewBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewBook((prev) => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const validateBook = (book) => {
        const errors = {};
        
        // Check required fields based on Book model
        if (!book.title.trim()) errors.title = 'Title is required';
        if (!book.author.trim()) errors.author = 'Author is required';
        if (!book.isbn.trim()) errors.isbn = 'ISBN is required';
        if (!book.price || isNaN(parseFloat(book.price)) || parseFloat(book.price) <= 0) 
            errors.price = 'Valid price is required';
        if (!book.units || isNaN(parseInt(book.units)) || parseInt(book.units) < 0) 
            errors.units = 'Valid units count is required';
        
        return errors;
    };

    const handleEditBook = (book) => {
        setBookToEdit(book);
        setNewBook({
            title: book.title,
            author: book.author,
            distributor: book.distributor || '',
            price: book.price.toString(),
            units: book.units.toString(),
            description: book.description || '',
            isbn: book.isbn || '',
            supplier_id: book.supplier_id || '',
            discount_id: book.discount_id || '',
            image: book.image || null
        });
        setIsEditingBook(true);
        setShowAddForm(true);
        setValidationErrors({});
    };

    const addBook = () => {
        if (showAddForm) {
            // Validate required fields
            const errors = validateBook(newBook);
            setValidationErrors(errors);
            
            // If there are validation errors, don't add/update the book
            if (Object.keys(errors).length > 0) {
                return;
            }
            
            // All validation passed, add or update the book
            const numericPrice = parseFloat(newBook.price);
            const numericUnits = parseInt(newBook.units);
            
            if (isEditingBook && bookToEdit) {
                // Update existing book
                const updatedBook = {
                    ...bookToEdit,
                    title: newBook.title,
                    author: newBook.author,
                    distributor: newBook.distributor || 'Unknown',
                    price: numericPrice,
                    units: numericUnits,
                    description: newBook.description,
                    isbn: newBook.isbn,
                    supplier_id: newBook.supplier_id,
                    discount_id: newBook.discount_id,
                    image: newBook.image,
                    updated_at: new Date()
                };
                
                setBooks((prev) => prev.map((book) => 
                    book.id === bookToEdit.id ? updatedBook : book
                ));
                setIsEditingBook(false);
                setBookToEdit(null);
            } else {
                // Add new book
                const bookToAdd = {
                    id: books.length + 1,
                    title: newBook.title,
                    author: newBook.author,
                    distributor: newBook.distributor || 'Unknown',
                    price: numericPrice,
                    units: numericUnits,
                    description: newBook.description,
                    isbn: newBook.isbn,
                    supplier_id: newBook.supplier_id,
                    discount_id: newBook.discount_id,
                    added_at: new Date()
                };
                
                setBooks((prev) => [...prev, bookToAdd]);
            }
            
            // Reset form
            setNewBook({ 
                title: '', 
                author: '', 
                distributor: '', 
                price: '', 
                units: '', 
                description: '', 
                isbn: '',
                supplier_id: '',
                discount_id: '',
                image: null 
            });
            setValidationErrors({});
            setShowAddForm(false);
        } else {
            // Show the form for adding a new book
            setIsEditingBook(false);
            setBookToEdit(null);
            setShowAddForm(true);
            setValidationErrors({});
        }
    };

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase()) ||
        book.distributor.toLowerCase().includes(filter.toLowerCase())
    );

    const handleSupplierFilterChange = (e) => {
        setSupplierFilter(e.target.value);
    };

    const handleNewSupplierChange = (e) => {
        const { name, value } = e.target;
        setNewSupplier((prev) => ({ ...prev, [name]: value }));
    };

    const validateSupplier = (supplier) => {
        const errors = {};
        
        // Check required fields
        if (!supplier.name.trim()) errors.name = 'Name is required';
        if (!supplier.contact_person.trim()) errors.contact_person = 'Contact person is required';
        if (!supplier.email.trim()) errors.email = 'Email is required';
        if (!supplier.phone.trim()) errors.phone = 'Phone is required';
        if (!supplier.address.trim()) errors.address = 'Address is required';
        if (!supplier.zip.trim()) errors.zip = 'Zip is required';
        if (!supplier.country.trim()) errors.country = 'Country is required';
        
        return errors;
    };

    const handleEditSupplier = (supplier) => {
        setSupplierToEdit(supplier);
        setNewSupplier({
            name: supplier.name,
            contact_person: supplier.contact_person,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address || '',
            city: supplier.city || '',
            state: supplier.state || '',
            zip: supplier.zip || '',
            country: supplier.country || '',
        });
        setIsEditingSupplier(true);
        setShowAddSupplierForm(true);
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
                country: '',
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
        supplier.contact_person.toLowerCase().includes(supplierFilter.toLowerCase()) ||
        supplier.email.toLowerCase().includes(supplierFilter.toLowerCase()) ||
        supplier.phone.toLowerCase().includes(supplierFilter.toLowerCase()) ||
        supplier.address.toLowerCase().includes(supplierFilter.toLowerCase())
    );

    const handleDeleteBook = (book) => {
        setItemToDelete(book);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteBook = () => {
        if (itemToDelete) {
            setBooks((prev) => prev.filter((book) => book.id !== itemToDelete.id));
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
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

    // Order handlers
    const handleOrderFilterChange = (e) => {
        setOrderFilter(e.target.value);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOrderDetailOpen(true);
    };

    const handleEditOrderStatus = (order, newStatus) => {
        const updatedOrder = {
            ...order,
            order_status: newStatus,
            updated_at: new Date()
        };
        
        setOrders(prev => prev.map(o => 
            o.id === order.id ? updatedOrder : o
        ));
    };

    const handleDeleteOrder = (order) => {
        setOrderToDelete(order);
        setDeleteOrderDialogOpen(true);
    };

    const confirmDeleteOrder = () => {
        if (orderToDelete) {
            setOrders((prev) => prev.filter((order) => order.id !== orderToDelete.id));
            setDeleteOrderDialogOpen(false);
            setOrderToDelete(null);
        }
    };

    const filteredOrders = orders.filter((order) =>
        order.customer_name.toLowerCase().includes(orderFilter.toLowerCase()) ||
        order.customer_id.toLowerCase().includes(orderFilter.toLowerCase()) ||
        order.order_status.toLowerCase().includes(orderFilter.toLowerCase()) ||
        (order.id.toString()).includes(orderFilter)
    );

    // Dashboard card items
    const dashboardCards = [
        { title: 'Content Section 1', icon: <AddIcon />, color: 'primary' },
        { title: 'Content Section 2', icon: <MenuIcon />, color: 'success' },
        { title: 'Content Section 3', icon: <AssessmentIcon />, color: 'secondary' }
    ];


    const sidebarContent = (
        <>
            <Toolbar 
                sx={{ 
                    bgcolor: '#1E201E', 
                    minHeight: '48px',
                    height: '48px',
                    p: 0,
                    borderRight: '1px solid #61677A'
                }} 
                variant="dense"
            >
                <Typography 
                    variant="subtitle1" 
                    color="#D8D9DA" 
                    noWrap 
                    component="div" 
                    align="center" 
                    sx={{ flexGrow: 1, pl: 0 }}
                >
                    BookStore Admin
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: '#61677A' }}/>
            <List sx={{ 
                bgcolor: '#1E201E', 
                color: '#D8D9DA', 
                pb: 0, 
                pt: 1, 
                px: 0,
                overflowY: 'auto', // Allow vertical scrolling if needed
                overflowX: 'hidden', // Prevent horizontal scrollbar
                height: 'calc(100vh - 48px)', // Subtract toolbar height from viewport height
                borderRight: '1px solid #61677A'
            }}>
                {navigation.map((item) => (
                    <ListItem 
                        key={item.name} 
                        disablePadding
                        sx={{ 
                            mx: 1,
                            px: 0,
                            my: 0
                        }}
                    >
                        <ListItemButton 
                            selected={activeSection === item.name}
                            onClick={() => handleNavigation(item.name)}
                            disableRipple
                            sx={{
                                pl: 1,
                                pr: 0.5,
                                py: 0.75,
                                width: 'auto',
                                maxWidth: `calc(${drawerWidth}px - 16px)`,
                                borderRadius: '12px',
                                '&.Mui-selected': {
                                    bgcolor: '#61677A',
                                    color: '#D8D9DA',
                                    '&:hover': {
                                        bgcolor: '#61677A',
                                        color: 'white'
                                    }
                                },
                                '&:hover': {
                                    bgcolor: '#6D7386',
                                    color: 'white'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <ListItemText 
                                primary={item.name} 
                                sx={{ 
                                    margin: 0,
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                {/* AppBar */}
                <AppBar
                    elevation={0}
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        bgcolor: '#1E201E',
                        minHeight: '48px',
                        p: 0,
                        borderBottom: '1px solid #61677A'
                    }}
                    variant="dense"
                >
                    <Toolbar 
                        sx={{ 
                            minHeight: '48px',
                            height: '48px',
                            p: 0 
                        }}
                        variant="dense"
                    >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <Avatar sx={{ bgcolor: 'grey.500' }}>FP</Avatar>
                    </Toolbar>
                </AppBar>

                {/* Sidebar / Drawer */}
                <Box
                    component="nav"
                    sx={{ 
                        width: { sm: drawerWidth }, 
                        flexShrink: { sm: 0 },
                        overflow: 'hidden' // Prevent scrollbars at the Box level
                    }}
                >
                    <Drawer
                        variant="temporary"
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#1E201E'},
                        }}
                    >
                        {sidebarContent}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { 
                                boxSizing: 'border-box', 
                                width: drawerWidth, 
                                backgroundColor: '#1E201E',
                                overflow: 'hidden' // Prevent scrollbars
                            },
                        }}
                        open
                    >
                        {sidebarContent}
                    </Drawer>
                </Box>

                {/* Main content */}
                <Box
                    component="main"
                    sx={{ 
                        flexGrow: 1, 
                        p: 0,           
                        width: { sm: `calc(100% - ${drawerWidth}px)` }, 
                        mt: '48px',     
                        bgcolor: '#1E201E', 
                        color: '#D8D9DA',
                        minHeight: 'calc(100vh - 48px)', 
                        overflow: 'hidden'
                    }}
                >
                    {/* Books Section */}
                    {activeSection === 'Books' ? (
                        <Box sx={{ p: 2 }}> 
                            {/* Book Add Form */}
                            {showAddForm && (
                                <Paper elevation={0} sx={{ 
                                    p: 3, 
                                    mb: 3, 
                                    bgcolor: '#1E201E', // Match body background
                                    borderRadius: 1
                                }}>
                                    <Grid container spacing={3}>
                                        {/* Image Upload */}
                                        <Grid item xs={12} md={6}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '300px', // Wider width
                                                    height: '400px', // Taller height to match all form fields
                                                    border: '2px dashed',
                                                    borderColor: '#61677A',
                                                    borderRadius: 1,
                                                    mx: 'auto', // Center horizontally
                                                    bgcolor: '#61677A',
                                                    position: 'relative'
                                                }}
                                                component="div"
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    
                                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                        const file = e.dataTransfer.files[0];
                                                        if (file.type.startsWith('image/')) {
                                                            setNewBook(prev => ({ ...prev, image: file }));
                                                        }
                                                    }
                                                }}
                                            >
                                                {newBook.image ? (
                                                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                                        <img
                                                            src={URL.createObjectURL(newBook.image)}
                                                            alt="Book preview"
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '100%', 
                                                                objectFit: 'cover' 
                                                            }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            sx={{ 
                                                                position: 'absolute', 
                                                                top: 8, 
                                                                right: 8,
                                                                bgcolor: 'white',
                                                                color: 'black',
                                                                '&:hover': { bgcolor: 'white' }
                                                            }}
                                                            onClick={() => setNewBook(prev => ({ ...prev, image: null }))}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Button
                                                            component="label"
                                                            variant="outlined"
                                                            startIcon={<UploadFileIcon />}
                                                            sx={{ 
                                                                mt: 1,
                                                                color: 'white',
                                                                borderColor: 'white',
                                                                '&:hover': {
                                                                    borderColor: 'white',
                                                                    bgcolor: 'rgba(255,255,255,0.1)'
                                                                }
                                                            }}
                                                        >
                                                            Upload Image
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                            />
                                                        </Button>
                                                        <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block" sx={{ mt: 1 }}>
                                                            or Drag and Drop
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>

                                        {/* Form Fields */}
                                        <Grid item xs={12} md={6}>
                                            <Grid container spacing={1} sx={{ p: 0.5 }}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Title"
                                                        name="title"
                                                        value={newBook.title}
                                                        onChange={handleNewBookChange}
                                                        placeholder="Book title"
                                                        size="small"
                                                        required
                                                        error={!!validationErrors.title}
                                                        helperText={validationErrors.title}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Author"
                                                        name="author"
                                                        value={newBook.author}
                                                        onChange={handleNewBookChange}
                                                        placeholder="Author name"
                                                        size="small"
                                                        required
                                                        error={!!validationErrors.author}
                                                        helperText={validationErrors.author}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="ISBN"
                                                        name="isbn"
                                                        value={newBook.isbn}
                                                        onChange={handleNewBookChange}
                                                        placeholder="ISBN number"
                                                        size="small"
                                                        required
                                                        error={!!validationErrors.isbn}
                                                        helperText={validationErrors.isbn}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Supplier ID"
                                                        name="supplier_id"
                                                        value={newBook.supplier_id}
                                                        onChange={handleNewBookChange}
                                                        placeholder="Supplier identifier"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Price"
                                                        name="price"
                                                        type="number"
                                                        value={newBook.price}
                                                        onChange={handleNewBookChange}
                                                        placeholder="0.00"
                                                        size="small"
                                                        required
                                                        error={!!validationErrors.price}
                                                        helperText={validationErrors.price}
                                                        inputProps={{ 
                                                            min: 0, 
                                                            step: 0.01,
                                                            inputMode: 'decimal',
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                                                '-webkit-appearance': 'none',
                                                                margin: 0
                                                            },
                                                            '& input[type=number]': {
                                                                '-moz-appearance': 'textfield'
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Units"
                                                        name="units"
                                                        type="number"
                                                        value={newBook.units}
                                                        onChange={handleNewBookChange}
                                                        placeholder="0"
                                                        size="small"
                                                        required
                                                        error={!!validationErrors.units}
                                                        helperText={validationErrors.units}
                                                        inputProps={{ min: 0 }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Discount ID"
                                                        name="discount_id"
                                                        value={newBook.discount_id}
                                                        onChange={handleNewBookChange}
                                                        placeholder="Discount identifier (if applicable)"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Description"
                                                        name="description"
                                                        value={newBook.description}
                                                        onChange={handleNewBookChange}
                                                        placeholder="Book description"
                                                        multiline
                                                        rows={3}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            )}

                            {/* Search controls and Table */}
                            <Paper elevation={0} sx={{ mb: 3, bgcolor: '#1E201E' }}>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <TextField
                                        placeholder="Search Books"
                                        size="small"
                                        value={filter}
                                        onChange={handleFilterChange}
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
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        {showAddForm && (
                                            <Button
                                                variant="outlined"
                                                size="medium"
                                                onClick={() => {
                                                    setShowAddForm(false);
                                                    setIsEditingBook(false);
                                                    setBookToEdit(null);
                                                    setNewBook({ 
                                                        title: '', 
                                                        author: '', 
                                                        distributor: '', 
                                                        price: '', 
                                                        units: '', 
                                                        description: '', 
                                                        isbn: '',
                                                        supplier_id: '',
                                                        discount_id: '',
                                                        image: null 
                                                    });
                                                    setValidationErrors({});
                                                }}
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
                                            variant="outlined"
                                            size="medium"
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
                                            FILTER
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            onClick={addBook}
                                            sx={{ 
                                                minWidth: 120,
                                                bgcolor: '#61677A',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: '#6D7386'
                                                }
                                            }}
                                        >
                                            {isEditingBook ? 'UPDATE BOOK' : 'ADD BOOK'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Table with lighter background */}
                            <Paper elevation={2} sx={{ bgcolor: '#2A2D2A', borderRadius: 1, border: '1px solid #61677A' }}>
                                <TableContainer sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
                                            <TableRow>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Title</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Author</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>ISBN</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Supplier ID</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Price</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Units</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Discount ID</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Added Date</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredBooks.map((book) => (
                                                <TableRow key={book.id} sx={{ 
                                                    '&:last-child td, &:last-child th': { 
                                                        border: 0 
                                                    },
                                                    '& td': {
                                                        borderColor: '#61677A'
                                                    }
                                                }}>
                                                    <TableCell>{book.title}</TableCell>
                                                    <TableCell>{book.author}</TableCell>
                                                    <TableCell>{book.isbn || 'N/A'}</TableCell>
                                                    <TableCell>{book.supplier_id || 'N/A'}</TableCell>
                                                    <TableCell>${book.price.toFixed(2)}</TableCell>
                                                    <TableCell>{book.units}</TableCell>
                                                    <TableCell>{book.discount_id || 'N/A'}</TableCell>
                                                    <TableCell>{book.added_at ? new Date(book.added_at).toLocaleDateString() : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex' }}>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleEditBook(book)}
                                                                sx={{ 
                                                                    color: '#6D7386',
                                                                    mr: 1,
                                                                    '&:hover': { 
                                                                        bgcolor: 'rgba(109, 115, 134, 0.1)' 
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleDeleteBook(book)}
                                                                sx={{ 
                                                                    color: '#ff6b6b',
                                                                    '&:hover': { 
                                                                        bgcolor: 'rgba(255, 107, 107, 0.1)' 
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredBooks.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={8} align="center">
                                                        No books found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

                            {/* Delete Book Confirmation Dialog */}
                            <Dialog
                                open={deleteDialogOpen}
                                onClose={() => setDeleteDialogOpen(false)}
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
                                        Deleting "{itemToDelete?.title}" cannot be undone.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button 
                                        onClick={() => setDeleteDialogOpen(false)}
                                        sx={{ 
                                            color: '#D8D9DA',
                                            '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={confirmDeleteBook}
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
                ) : activeSection === 'Suppliers' ? (
                        <Box sx={{ p: 2 }}>
                            {/* Supplier Add Form */}
                            {showAddSupplierForm && (
                                <Paper elevation={0} sx={{ 
                                    p: 3, 
                                    mb: 3, 
                                    bgcolor: '#1E201E', // Match body background
                                    borderRadius: 1
                                }}>
                                    <Grid container spacing={3} justifyContent="center">
                                        {/* Form Fields */}
                                        <Grid item xs={12} md={7}>
                                            <Grid container spacing={1} sx={{ p: 0.5 }}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Supplier Name"
                                                        name="name"
                                                        value={newSupplier.name}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="Supplier name"
                                                        size="small"
                                                        required
                                                        error={!!supplierValidationErrors.name}
                                                        helperText={supplierValidationErrors.name}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Contact Person"
                                                        name="contact_person"
                                                        value={newSupplier.contact_person}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="Primary contact"
                                                        size="small"
                                                        required
                                                        error={!!supplierValidationErrors.contact_person}
                                                        helperText={supplierValidationErrors.contact_person}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email"
                                                        name="email"
                                                        value={newSupplier.email}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="contact@supplier.com"
                                                        size="small"
                                                        required
                                                        error={!!supplierValidationErrors.email}
                                                        helperText={supplierValidationErrors.email}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Phone"
                                                        name="phone"
                                                        value={newSupplier.phone}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="555-123-4567"
                                                        size="small"
                                                        required
                                                        error={!!supplierValidationErrors.phone}
                                                        helperText={supplierValidationErrors.phone}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                color: '#ff6b6b'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Address"
                                                        name="address"
                                                        value={newSupplier.address}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="Full address"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="City"
                                                        name="city"
                                                        value={newSupplier.city}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="City"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="State"
                                                        name="state"
                                                        value={newSupplier.state}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="State"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="Zip"
                                                        name="zip"
                                                        value={newSupplier.zip}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="Zip"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="Country"
                                                        name="country"
                                                        value={newSupplier.country}
                                                        onChange={handleNewSupplierChange}
                                                        placeholder="Country"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#2A2D2A' // Lighter shade for input
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            )}

                            {/* Search controls and Table */}
                            <Paper elevation={0} sx={{ mb: 3, bgcolor: '#1E201E' }}>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
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
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        {showAddSupplierForm && (
                                            <Button
                                                variant="outlined"
                                                size="medium"
                                                onClick={() => {
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
                                                        country: '',
                                                    });
                                                    setSupplierValidationErrors({});
                                                }}
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
                                            variant="outlined"
                                            size="medium"
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
                                            FILTER
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            onClick={addSupplier}
                                            sx={{ 
                                                minWidth: 120,
                                                bgcolor: '#61677A',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: '#6D7386'
                                                }
                                            }}
                                        >
                                            {isEditingSupplier ? 'UPDATE SUPPLIER' : 'ADD SUPPLIER'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Table with lighter background */}
                            <Paper elevation={2} sx={{ bgcolor: '#2A2D2A', borderRadius: 1, border: '1px solid #61677A' }}>
                                <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
                                            <TableRow>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Name</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Contact Person</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Email</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Phone</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Address</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Added Date</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredSuppliers.map((supplier) => (
                                                <TableRow key={supplier.id} sx={{ 
                                                    '&:last-child td, &:last-child th': { 
                                                        border: 0 
                                                    },
                                                    '& td': {
                                                        borderColor: '#61677A'
                                                    }
                                                }}>
                                                    <TableCell>{supplier.name}</TableCell>
                                                    <TableCell>{supplier.contact_person}</TableCell>
                                                    <TableCell>{supplier.email}</TableCell>
                                                    <TableCell>{supplier.phone}</TableCell>
                                                    <TableCell>
                                                        {[
                                                            supplier.address, 
                                                            supplier.city, 
                                                            supplier.state, 
                                                            supplier.zip,
                                                            supplier.country
                                                        ].filter(Boolean).join(', ') || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>{supplier.added_at ? new Date(supplier.added_at).toLocaleDateString() : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex' }}>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleEditSupplier(supplier)}
                                                                sx={{ 
                                                                    color: '#6D7386',
                                                                    mr: 1,
                                                                    '&:hover': { 
                                                                        bgcolor: 'rgba(109, 115, 134, 0.1)' 
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleDeleteSupplier(supplier)}
                                                                sx={{ 
                                                                    color: '#ff6b6b',
                                                                    '&:hover': { 
                                                                        bgcolor: 'rgba(255, 107, 107, 0.1)' 
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredSuppliers.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center">
                                                        No suppliers found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

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
                                        Deleting supplier "{supplierToDelete?.name}" cannot be undone.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button 
                                        onClick={() => setDeleteSupplierDialogOpen(false)}
                                        sx={{ 
                                            color: '#D8D9DA',
                                            '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
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
                    ) : activeSection === 'Orders' ? (
                        <Box sx={{ p: 2 }}>
                            {/* Search controls and Table */}
                            <Paper elevation={0} sx={{ mb: 3, bgcolor: '#1E201E' }}>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <TextField
                                        placeholder="Search Orders"
                                        size="small"
                                        value={orderFilter}
                                        onChange={handleOrderFilterChange}
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
                                </Box>
                            </Paper>

                            {/* Table with lighter background */}
                            <Paper elevation={2} sx={{ bgcolor: '#2A2D2A', borderRadius: 1, border: '1px solid #61677A' }}>
                                <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
                                            <TableRow>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Order ID</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Customer Email</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Order Date</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Delivery Date</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Status</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Total</TableCell>
                                                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredOrders.map((order) => (
                                                <TableRow 
                                                    key={order.id} 
                                                    sx={{ 
                                                        '&:last-child td, &:last-child th': { 
                                                            border: 0 
                                                        },
                                                        '& td': {
                                                            borderColor: '#61677A'
                                                        },
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(97, 103, 122, 0.2)'
                                                        }
                                                    }}
                                                    onClick={() => handleViewOrder(order)}
                                                >
                                                    <TableCell>#{order.id.toString().padStart(5, '0')}</TableCell>
                                                    <TableCell>{order.customer_email}</TableCell>
                                                    <TableCell>{order.order_date.toLocaleDateString()}</TableCell>
                                                    <TableCell>{order.delivery_date ? order.delivery_date.toLocaleDateString() : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Box 
                                                            sx={{ 
                                                                display: 'inline-block',
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                fontSize: '0.8rem',
                                                                fontWeight: 'medium',
                                                                bgcolor: order.order_status === 'Delivered' 
                                                                    ? 'rgba(46, 125, 50, 0.2)'
                                                                    : order.order_status === 'Processing'
                                                                    ? 'rgba(30, 73, 118, 0.2)'
                                                                    : order.order_status === 'Shipped'
                                                                    ? 'rgba(245, 124, 0, 0.2)'
                                                                    : 'rgba(211, 47, 47, 0.2)',
                                                                color: order.order_status === 'Delivered' 
                                                                    ? '#66bb6a'
                                                                    : order.order_status === 'Processing'
                                                                    ? '#42a5f5'
                                                                    : order.order_status === 'Shipped'
                                                                    ? '#ffa726'
                                                                    : '#ef5350'
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent row click
                                                            }}
                                                        >
                                                            {order.order_status}
                                                        </Box> 
                                                    </TableCell>
                                                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                                        <Box sx={{ display: 'flex' }}>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewOrder(order);
                                                                }}
                                                                sx={{ 
                                                                    color: '#6D7386',
                                                                    mr: 1,
                                                                    '&:hover': { 
                                                                        bgcolor: 'rgba(109, 115, 134, 0.1)' 
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteOrder(order);
                                                                }}
                                                                sx={{ 
                                                                    color: '#ff6b6b',
                                                                    '&:hover': { 
                                                                        bgcolor: 'rgba(255, 107, 107, 0.1)' 
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredOrders.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center">
                                                        No orders found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

                            {/* Order Detail Dialog */}
                            <Dialog
                                open={orderDetailOpen}
                                onClose={() => setOrderDetailOpen(false)}
                                fullWidth
                                maxWidth="md"
                                PaperProps={{
                                    sx: {
                                        bgcolor: '#25292A',
                                        color: '#D8D9DA',
                                        borderRadius: 1,
                                        border: '1px solid #61677A',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }
                                }}
                            >
                                {selectedOrder && (
                                    <>
                                        <DialogTitle sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            borderBottom: '1px solid #404448',
                                            bgcolor: '#1E201E',
                                            mb: 2
                                        }}>
                                            <Box>
                                                <Typography variant="h5" sx={{ fontWeight: 400 }}>
                                                    Order #{selectedOrder.id.toString().padStart(5, '0')}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={{ color: '#A7A7A7' }}>Status:</Typography>
                                                <TextField
                                                    select
                                                    size="small"
                                                    value={selectedOrder.order_status}
                                                    onChange={(e) => handleEditOrderStatus(selectedOrder, e.target.value)}
                                                    sx={{
                                                        minWidth: 150,
                                                        '& .MuiOutlinedInput-root': {
                                                            bgcolor: '#1E201E'
                                                        }
                                                    }}
                                                >
                                                    {orderStatusOptions.map(option => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Box>
                                        </DialogTitle>
                                        <DialogContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#A7A7A7' }}>Billed To</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.customer_name}</Typography>
                                                    <Typography variant="body2">{selectedOrder.customer_address}</Typography>
                                                    <Typography variant="body2">{selectedOrder.customer_email}</Typography>
                                                    <Typography variant="body2">{selectedOrder.customer_phone}</Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#A7A7A7' }}>Invoice Details</Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                                                        <Typography variant="body2" sx={{ color: '#A7A7A7' }}>Invoice Date:</Typography>
                                                        <Typography variant="body2">{selectedOrder.order_date.toLocaleDateString()}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                                                        <Typography variant="body2" sx={{ color: '#A7A7A7' }}>Delivery Date:</Typography>
                                                        <Typography variant="body2">{selectedOrder.delivery_date ? selectedOrder.delivery_date.toLocaleDateString() : 'N/A'}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                                                        <Typography variant="body2" sx={{ color: '#A7A7A7' }}>Status:</Typography>
                                                        <Typography variant="body2" sx={{ 
                                                            color: selectedOrder.order_status === 'Delivered' 
                                                                ? '#66bb6a'
                                                                : selectedOrder.order_status === 'Processing'
                                                                ? '#42a5f5'
                                                                : selectedOrder.order_status === 'Shipped'
                                                                ? '#ffa726'
                                                                : '#ef5350'
                                                        }}>
                                                            {selectedOrder.order_status}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            
                                            <Paper elevation={0} sx={{ 
                                                bgcolor: '#1E201E', 
                                                borderRadius: 1, 
                                                overflow: 'hidden',
                                                border: '1px solid #404448',
                                                mb: 4
                                            }}>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead sx={{ bgcolor: '#313539' }}>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF' }}>Item</TableCell>
                                                                <TableCell align="center" sx={{ fontWeight: 600, color: '#FFFFFF' }}>Quantity</TableCell>
                                                                <TableCell align="right" sx={{ fontWeight: 600, color: '#FFFFFF' }}>Price</TableCell>
                                                                <TableCell align="right" sx={{ fontWeight: 600, color: '#FFFFFF' }}>Subtotal</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {selectedOrder.items.map((item) => (
                                                                <TableRow key={item.book_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell sx={{ py: 2 }}>{item.title}</TableCell>
                                                                    <TableCell align="center" sx={{ py: 2 }}>{item.quantity}</TableCell>
                                                                    <TableCell align="right" sx={{ py: 2 }}>${item.price.toFixed(2)}</TableCell>
                                                                    <TableCell align="right" sx={{ py: 2 }}>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>
                                            
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'flex-end',
                                                bgcolor: '#1E201E',
                                                borderRadius: 1,
                                                p: 2,
                                                border: '1px solid #404448'
                                            }}>
                                                <Box sx={{ width: '250px' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                                        <Typography variant="body2" sx={{ color: '#A7A7A7' }}>Subtotal:</Typography>
                                                        <Typography variant="body2">${selectedOrder.total_amount.toFixed(2)}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                                        <Typography variant="body2" sx={{ color: '#A7A7A7' }}>Tax (0%):</Typography>
                                                        <Typography variant="body2">$0.00</Typography>
                                                    </Box>
                                                    <Divider sx={{ my: 1.5, borderColor: '#404448' }} />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>Total:</Typography>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>${selectedOrder.total_amount.toFixed(2)}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </DialogContent>
                                        <DialogActions sx={{ borderTop: '1px solid #404448', px: 3, py: 2 }}>
                                            <Button 
                                                onClick={() => setOrderDetailOpen(false)}
                                                sx={{ 
                                                    color: '#D8D9DA',
                                                    '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
                                                }}
                                            >
                                                Close
                                            </Button>
                                            <Button 
                                                variant="contained"
                                                startIcon={<PrintIcon />}
                                                onClick={() => {
                                                    // Generate and print invoice functionality would go here
                                                    setOrderDetailOpen(false);
                                                }}
                                                sx={{ 
                                                    bgcolor: '#61677A',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: '#6D7386' }
                                                }}
                                            >
                                                Print Invoice
                                            </Button>
                                        </DialogActions>
                                    </>
                                )}
                            </Dialog>

                            {/* Delete Order Confirmation Dialog */}
                            <Dialog
                                open={deleteOrderDialogOpen}
                                onClose={() => setDeleteOrderDialogOpen(false)}
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
                                        Deleting order #{orderToDelete?.id.toString().padStart(5, '0')} cannot be undone.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button 
                                        onClick={() => setDeleteOrderDialogOpen(false)}
                                        sx={{ 
                                            color: '#D8D9DA',
                                            '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={confirmDeleteOrder}
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
                    ) : (
                        <Box sx={{ p: 1 }}>
                            <Grid container spacing={3}>
                                {dashboardCards.map((card, index) => (
                                    <Grid item xs={12} sm={6} lg={4} key={index}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            bgcolor: `${card.color}.main`, 
                                                            width: 56, 
                                                            height: 56 
                                                        }}
                                                    >
                                                        {card.icon}
                                                    </Avatar>
                                                    <Box sx={{ ml: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {card.title}
                                                        </Typography>
                                                        <Typography variant="h6">
                                                            Your content here
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default ManagmentPage;