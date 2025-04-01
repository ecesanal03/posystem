// Updated Checkout.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Container, Grid, Typography, Stepper, Step, StepLabel, Card, CardContent, Button, Divider,
    AppBar, Toolbar, IconButton, CircularProgress, TextField, MenuItem
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import cartApi from '../api/cartApi';
import customerApi from '../api/customerApi';
import { useNavigate, Link } from 'react-router-dom';
import orderApi from '../api/ordersAPI';

const steps = ['Shipping Details', 'Payment Information', 'Review Order'];

const usStates = [
    { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' }, { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' }, { name: 'Florida', code: 'FL' },
    { name: 'Georgia', code: 'GA' }, { name: 'Hawaii', code: 'HI' }, { name: 'Idaho', code: 'ID' },
    { name: 'Illinois', code: 'IL' }, { name: 'Indiana', code: 'IN' }, { name: 'Iowa', code: 'IA' },
    { name: 'Kansas', code: 'KS' }, { name: 'Kentucky', code: 'KY' }, { name: 'Louisiana', code: 'LA' },
    { name: 'Maine', code: 'ME' }, { name: 'Maryland', code: 'MD' }, { name: 'Massachusetts', code: 'MA' },
    { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' }, { name: 'Mississippi', code: 'MS' },
    { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' }, { name: 'Nebraska', code: 'NE' },
    { name: 'Nevada', code: 'NV' }, { name: 'New Hampshire', code: 'NH' }, { name: 'New Jersey', code: 'NJ' },
    { name: 'New Mexico', code: 'NM' }, { name: 'New York', code: 'NY' }, { name: 'North Carolina', code: 'NC' },
    { name: 'North Dakota', code: 'ND' }, { name: 'Ohio', code: 'OH' }, { name: 'Oklahoma', code: 'OK' },
    { name: 'Oregon', code: 'OR' }, { name: 'Pennsylvania', code: 'PA' }, { name: 'Rhode Island', code: 'RI' },
    { name: 'South Carolina', code: 'SC' }, { name: 'South Dakota', code: 'SD' }, { name: 'Tennessee', code: 'TN' },
    { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' }, { name: 'Vermont', code: 'VT' },
    { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' }, { name: 'West Virginia', code: 'WV' },
    { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
];

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shippingInfo, setShippingInfo] = useState({
        email: '', address1: '', address2: '', city: '', state: '', zip: '', country: 'United States'
    });
    const [paymentInfo, setPaymentInfo] = useState({ method: '', cardNumber: '', nameOnCard: '', expiry: '', cvv: '' });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const [cartRes, customerProfile] = await Promise.all([
              cartApi.getCart(),
              customerApi.getMyProfile()
            ]);
      
            setCartItems(cartRes.items || []);
      
            if (customerProfile) {
              setShippingInfo(prev => ({
                ...prev,
                email: customerProfile.email || '',
                address1: customerProfile.addressLineOne || '',
                address2: customerProfile.addressLineTwo || '',
                city: customerProfile.city || '',
                state: customerProfile.state || '',
                zip: customerProfile.zipCode || '',
                country: customerProfile.country || ''
              }));
            }
          } catch (error) {
            console.error("Error fetching cart or customer profile:", error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, []);
      
    

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = 8.0;
    const tax = 0.0;
    const total = subtotal + shipping + tax;

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handlePlaceOrder = async () => {
        try {
            const cartRes = await cartApi.getCart(); // get fresh cart in case anything changed
            const cartId = cartRes.id; // make sure this exists
    
            const payload = {
                order_Date: new Date().toISOString(),
                delivery_Date: null,
                order_Status: 'Pending',
                payment_Method: paymentInfo.method,
                cartId: cartId,
                cartItems: cartRes.items.map(item => ({
                    bookId: item.bookId,
                    quantity: item.quantity
                }))
            };
    
            const response = await orderApi.placeOrder(payload);
    
            if (response.success) {
                alert("Order placed successfully!");
                setCartItems([]);  // Clear cart in frontend
                setActiveStep(0);  // Go back to start
                navigate('/');
            } else {
                alert(`Failed to place order: ${response.message}`);
            }
        } catch (error) {
            console.error('Order error:', error);
            alert("Something went wrong while placing the order.");
        }
    };

    return (
        <Box>
            <AppBar sx={{ backgroundColor: '#8499D9' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" href="/cart">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Checkout</Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 12 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Checkout
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                {activeStep === 0 && (
                                    <>
                                        <Typography variant="h6" gutterBottom>Shipping Details</Typography>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            value={shippingInfo.email}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            label="Address Line 1"
                                            fullWidth
                                            value={shippingInfo.address1}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, address1: e.target.value })}
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            label="Address Line 2"
                                            fullWidth
                                            value={shippingInfo.address2}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, address2: e.target.value })}
                                            sx={{ mb: 2 }}
                                        />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="City"
                                                    fullWidth
                                                    value={shippingInfo.city}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    select
                                                    label="State"
                                                    fullWidth
                                                    value={shippingInfo.state}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                                >
                                                    {usStates.map((s) => (
                                                        <MenuItem key={s.code} value={s.code}>{s.code}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Zip Code"
                                                    fullWidth
                                                    value={shippingInfo.zip}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Country"
                                                    fullWidth
                                                    value={shippingInfo.country}
                                                    disabled
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button variant="contained" sx={{ mt: 3 }} onClick={handleNext}>Continue to Payment</Button>
                                    </>
                                )}

                                {activeStep === 1 && (
                                    <>
                                        <Typography variant="h6" gutterBottom>Payment Method</Typography>
                                        <TextField
                                            select
                                            label="Select Payment Method"
                                            fullWidth
                                            value={paymentInfo.method}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, method: e.target.value })}
                                            sx={{ mb: 2 }}
                                        >
                                            {['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet'].map((method) => (
                                                <MenuItem key={method} value={method}>
                                                    {method}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <Button 
                                            variant="contained" 
                                            sx={{ mt: 3 }} 
                                            onClick={handleNext}
                                            disabled={!paymentInfo.method} // Prevent continuing without selection
                                        >
                                            Continue to Review
                                        </Button>
                                        <Button sx={{ mt: 2, ml: 2 }} onClick={handleBack}>Back</Button>
                                    </>
                                )}

                                {activeStep === 2 && (
                                    <>
                                        <Typography variant="h6" gutterBottom>Review Your Order</Typography>
                                        {loading ? (
                                            <CircularProgress />
                                        ) : (
                                            <Box>
                                                {cartItems.map((item) => (
                                                    <Box key={item.id} sx={{ mb: 2 }}>
                                                        <Typography variant="body1">
                                                            {item.bookTitle} — ${item.price.toFixed(2)} x {item.quantity}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    <strong>Payment Method:</strong> {paymentInfo.method}
                                                </Typography>

                                                <Divider sx={{ my: 2 }} />
                                                <Typography variant="body1">Subtotal: ${subtotal.toFixed(2)}</Typography>
                                                <Typography variant="body1">Shipping: ${shipping.toFixed(2)}</Typography>
                                                <Typography variant="body1">Tax: ${tax.toFixed(2)}</Typography>
                                                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                    Total: ${total.toFixed(2)}
                                                </Typography>
                                                <Divider sx={{ my: 2 }} />
                                                <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
                                                    PLACE ORDER
                                                </Button>
                                                <Button sx={{ ml: 2 }} onClick={handleBack}>Back</Button>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#f5f5f5' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    ORDER SUMMARY
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>Subtotal: ${subtotal.toFixed(2)}</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>Shipping: ${shipping.toFixed(2)}</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>Tax: ${tax.toFixed(2)}</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" color="warning.main">Total: ${total.toFixed(2)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Checkout;