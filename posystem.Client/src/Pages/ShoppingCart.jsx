import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, IconButton, TextField, AppBar, Toolbar, Box } from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import cartApi from '../api/cartApi';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart();
      setCartItems(response.items || []);
      updateCartTotal(response.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const updateCartTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.discount_Value
        ? item.price - (item.price * item.discount_Value / 100)
        : item.price;
      return sum + price * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (bookId) => {
    try {
      await cartApi.removeFromCart(bookId);
      const updatedItems = cartItems.filter(item => item.bookId !== bookId);
      setCartItems(updatedItems);
      updateCartTotal(updatedItems);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    try {
      await cartApi.updateCartQuantity(bookId, newQuantity);
      await fetchCart(); // Re-fetch the whole cart to get updated discounts and quantities
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const goBack = () => navigate('/');
  const handleProceedToCheckout = () => navigate('/checkout');

  return (
    <div>
      <AppBar sx={{ backgroundColor: '#8499D9' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Shopping Cart</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Paper sx={{ padding: 3, maxWidth: '100vh', margin: '0 auto' }}>
                <Grid container justifyContent="center">
                  <img src="/logo.png" alt="png" style={{ width: '150px', marginBottom: '20px' }} />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ padding: 3 }}>
                      {cartItems.length > 0 ? (
                        cartItems.map((item) => {
                          const hasDiscount = item.discount_Value && item.discount_Value > 0;
                          const discountedPrice = hasDiscount
                            ? (item.price - item.price * item.discount_Value / 100).toFixed(2)
                            : item.price.toFixed(2);
                          const itemTotal = hasDiscount
                            ? (item.price - item.price * item.discount_Value / 100) * item.quantity
                            : item.price * item.quantity;

                          return (
                            <Grid container key={item.id} spacing={2} sx={{ marginBottom: 2 }}>
                              <Grid item xs={8}>
                                <Typography variant="h6">{item.bookTitle}</Typography>

                                {hasDiscount ? (
                                  <>
                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#999' }}>
                                      Original: ${item.price.toFixed(2)} x {item.quantity}
                                    </Typography>
                                    <Typography variant="body2" color="secondary">
                                      Discounted: ${discountedPrice} x {item.quantity}
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                      Discount: {item.discount_Name || 'Applied'} ({item.discount_Value}% off)
                                    </Typography>
                                  </>
                                ) : (
                                  <Typography variant="body2">
                                    Price: ${item.price.toFixed(2)} x {item.quantity}
                                  </Typography>
                                )}

                                <Typography variant="body2" fontWeight="bold">
                                  Item Total: ${itemTotal.toFixed(2)}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <TextField
                                  type="number"
                                  label="Quantity"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value))}
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
                      <Typography variant="h5" gutterBottom>Cart Summary</Typography>
                      <Typography variant="body1">{`Total: $${cartTotal.toFixed(2)}`}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        onClick={handleProceedToCheckout}
                      >
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
