import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, IconButton, TextField, AppBar, Toolbar, Box } from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import cartApi from '../api/cartApi';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook to navigate
  const location = useLocation();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartApi.getCart();
        setCartItems(response.items || []);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };
  
    fetchCart();
  }, []);
  

  const removeItem = async (bookId) => {
    try {
      await cartApi.removeFromCart(bookId);
      setCartItems(prev => prev.filter(item => item.bookId !== bookId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };
  
  const updateQuantity = async (bookId, newQuantity) => {
    try {
      await cartApi.updateCartQuantity(bookId, newQuantity);
  
      // Re-fetch the cart after quantity update to reflect updated discounts
      const response = await cartApi.getCart();
      setCartItems(response.items || []);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discounted = item.discount_Value
        ? item.price - (item.price * item.discount_Value / 100)
        : item.price;
      return total + (discounted * item.quantity);
    }, 0).toFixed(2);
  };

  const goBack = () => {
    navigate('/'); // Navigate back to the previous page
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  return (
    <div>
      {/* Top Bar */}
      <AppBar  sx={{ backgroundColor: '#8499D9' }}>
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
        paddingTop: 10 
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
                    cartItems.map((item) => {
                      const discountAmount = item.discount_Value
                        ? (item.price * item.discount_Value / 100).toFixed(2)
                        : null;

                      const discountedPrice = item.discount_Value
                        ? (item.price - (item.price * item.discount_Value / 100)).toFixed(2)
                        : item.price.toFixed(2);

                      const itemTotal = item.discount_Value
                        ? (item.price - (item.price * item.discount_Value / 100)) * item.quantity
                        : item.price * item.quantity;

                      return (
                        <Grid container key={item.id} spacing={2} sx={{ marginBottom: 2 }}>
                          <Grid item xs={8}>
                            <Typography variant="h6">{item.bookTitle}</Typography>

                            <Typography variant="body2">
                              Price: ${item.price.toFixed(2)} x {item.quantity}
                            </Typography>

                            {item.discount_Name && (
                              <>
                                <Typography variant="body2" color="success.main">
                                  Discount: {item.discount_Name} ({item.discount_Value}% off)
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                  Discounted Price: ${discountedPrice} x {item.quantity}
                                </Typography>
                              </>
                            )}
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              type="number"
                              label="Quantity"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.bookId, parseInt(e.target.value))
                              }
                              sx={{ width: '100%' }}
                            />
                          </Grid>

                          <Grid item xs={1}>
                            <IconButton color="error" onClick={() => removeItem(item.bookId)}>
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })
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
                        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handleProceedToCheckout}>
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
