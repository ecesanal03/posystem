import { useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Toolbar,
  IconButton,
  Typography,
  AppBar,
  Avatar
} from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import BookIcon from '@mui/icons-material/Book';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';

import theme from './styles/theme';
import BooksSection from './components/Books';
import SuppliersSection from './components/Suppliers';
import OrdersSection from './components/Orders';
import AccountsSection from './components/Accounts';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    backgroundColor: '#1E1E1E',
    minHeight: '100vh',
    height: '100vh',
    color: 'white',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#25292A',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  backgroundColor: '#25292A',
  color: 'white'
}));

const DrawerStyled = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#25292A',
    color: 'white',
    borderRight: '1px solid #61677A'
  },
}));

const ManagementPage = () => {
  const [open, setOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('books');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Navigation items with icons
  const navigation = [
    { name: 'books', label: 'Books', icon: <BookIcon sx={{ color: '#536DFE' }} /> },
    { name: 'suppliers', label: 'Suppliers', icon: <LocalShippingIcon sx={{ color: '#FF9800' }} /> },
    { name: 'orders', label: 'Orders', icon: <ReceiptIcon sx={{ color: '#4CAF50' }} /> },
    { name: 'accounts', label: 'Accounts', icon: <PeopleIcon sx={{ color: '#E91E63' }} /> },
    { name: 'reports', label: 'Reports', icon: <AssessmentIcon sx={{ color: '#9C27B0' }} /> },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'books':
        return <BooksSection />;
      case 'suppliers':
        return <SuppliersSection />;
      case 'orders':
        return <OrdersSection />;
      case 'accounts':
        return <AccountsSection />;
      case 'reports':
        // Will add this section later
        return <Box sx={{ p: 3 }}>Reports Coming Soon</Box>;
      default:
        return <BooksSection />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Cougar Cataloge Employee Portal
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar sx={{ bgcolor: 'grey.500' }}>FP</Avatar>
          </Toolbar>
        </AppBarStyled>
        <DrawerStyled
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1, ml: 2 }}>
              Management
            </Typography>
            <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ bgcolor: '#61677A' }} />
          <List>
            {navigation.map((item) => (
              <ListItemButton 
                key={item.name}
                selected={selectedTab === item.name}
                onClick={() => setSelectedTab(item.name)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(97, 103, 122, 0.25)'
                  },
                  '&.Mui-selected:hover': {
                    bgcolor: 'rgba(97, 103, 122, 0.35)'
                  },
                  '&:hover': {
                    bgcolor: 'rgba(97, 103, 122, 0.15)'
                  }
                }}
              >
                {item.icon && (
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                )}
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </DrawerStyled>
        <Main open={open}>
          <DrawerHeader />
          {renderContent()}
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default ManagementPage; 