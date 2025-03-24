import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Button, IconButton, TextField, AppBar, Toolbar, Box } from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // React Router's useNavigate for back functionality

const ShoppingCart = () => {
  const initialCart = [
    { id: 1, name: 'The Great Gatsby', price: 10.99, quantity: 1 },
    { id: 2, name: '1984', price: 8.99, quantity: 2 },
    { id: 3, name: 'To Kill a Mockingbird', price: 12.99, quantity: 1 },
    { id: 4, name: 'Test', price: 12.99, quantity: 1 },
  ];

  const [cartItems, setCartItems] = useState(initialCart);
  const navigate = useNavigate(); // Navigate hook for handling back navigation

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const goBack = () => {
    navigate('/'); // Navigates to the previous page
  };

  return (
    <div>
      {/* Top Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#8499D9' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shopping Cart
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        paddingTop: 4 
        }}>
        <Container maxWidth="lg">
            <Grid container spacing={3} justifyContent="center">
            {/* Sidebar or Logo Section */}
            <Grid item xs={12} >
                <Paper sx={{ padding: 3, maxWidth: '100vh', margin: '0 auto' }}>
                <Grid container justifyContent="center">
                    <img 
                    src="/logo.png" 
                    alt="png"
                    style={{ width: '150px', marginBottom: '20px' }}
                    />
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                    <Paper sx={{ padding: 3 }}>
                        {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <Grid container key={item.id} spacing={2} sx={{ marginBottom: 2 }}>
                            <Grid item xs={8}>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography variant="body2">{`$${item.price} x ${item.quantity}`}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                type="number"
                                label="Quantity"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                sx={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton color="error" onClick={() => removeItem(item.id)}>
                                <Delete />
                                </IconButton>
                            </Grid>
                            </Grid>
                        ))
                        ) : (
                        <Typography variant="h6">Your cart is empty!</Typography>
                        )}
                    </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom>
                        Cart Summary
                        </Typography>
                        <Typography variant="body1">{`Total: $${calculateTotal()}`}</Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                        Proceed to Checkout
                        </Button>
                    </Paper>
                    </Grid>
                </Grid>
                </Paper>
            </Grid>
            </Grid>
        </Container>
        </Box>

    </div>
  );
};

export default ShoppingCart;
