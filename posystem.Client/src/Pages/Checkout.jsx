import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Toolbar,
    Typography,
    Collapse
} from '@mui/material';
import {
    ShoppingBag as ShoppingBagIcon,
    LocalPhone as LocalPhoneIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const SectionHeader = styled(Paper)(({ theme }) => ({
    backgroundColor: '#424242',
    color: 'white',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const StepTitle = styled(Typography)({
    fontWeight: 'bold',
});

const OrangeButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#f57c00',
    color: 'white',
    '&:hover': {
        backgroundColor: '#ef6c00',
    },
}));

const GreenCheckCircle = styled(CheckCircleIcon)(({ theme }) => ({
    color: '#2e7d32',
    marginRight: theme.spacing(1),
}));

const CompletedSection = styled(Box)(({ theme }) => ({
    backgroundColor: '#f9f9f9',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #e0e0e0',
}));

// US States list
const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
    'Wisconsin', 'Wyoming', 'District of Columbia'
];

const Checkout = () => {
    // State management
    const [activeStep, setActiveStep] = useState(0);
    const [addressType, setAddressType] = useState('home');
    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        phone: ''
    });
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        nameOnCard: '',
        expiryDate: '',
        cvv: '',
        billingAddress: 'same'
    });
    const [billingData, setBillingData] = useState({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        phone: ''
    });
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [savedAddressLoaded, setSavedAddressLoaded] = useState(false);

    // Product and pricing data
    const subtotal = 20.00;
    const shipping = 8.00;
    const tax = 0.00;
    const total = subtotal + shipping + tax;

    // Step labels
    const steps = ['Shipping Details', 'Payment Information', 'Review Order'];

    // Mock user data - this would come from your backend
    const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'New York',
        zipCode: '10001',
        email: 'john.doe@example.com',
        phone: '2125551234'
    };

    // Load user data if logged in
    useEffect(() => {
        // This would be an API call to check if the user is logged in
        // For now, we'll simulate a logged-in user
        setIsUserLoggedIn(true);

        // If user is logged in and we haven't loaded their address yet
        if (isUserLoggedIn && !savedAddressLoaded && addressType === 'home') {
            // Format phone number before setting the data
            const formattedUserData = {
                ...mockUserData,
                phone: formatPhoneNumber(mockUserData.phone)
            };
            setShippingData(formattedUserData);
            setSavedAddressLoaded(true);
        }
    }, [isUserLoggedIn, savedAddressLoaded, addressType]);

    // Handle shipping form changes
    const handleShippingChange = (event) => {
        const { name, value } = event.target;
        setShippingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle payment form changes
    const handlePaymentChange = (event) => {
        const { name, value } = event.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle billing form changes
    const handleBillingChange = (event) => {
        const { name, value } = event.target;
        setBillingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressTypeChange = (event) => {
        const newAddressType = event.target.value;
        setAddressType(newAddressType);
        
        // If changing to "different address", clear the form fields
        if (newAddressType === 'otheraddress') {
            setShippingData({
                firstName: '',
                lastName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
                email: '',
                phone: ''
            });
        } else if (newAddressType === 'home' && isUserLoggedIn) {
            // If changing back to "home" and user is logged in, load saved address
            setShippingData(mockUserData);
        }
    };

    // Format phone number as (XXX) XXX-XXXX
    const formatPhoneNumber = (value) => {
        if (!value) return value;
        
        // Remove all non-digits
        const phoneNumber = value.replace(/\D/g, '');
        
        // Limit to 10 digits
        const truncatedNumber = phoneNumber.substring(0, 10);
        
        // Format based on length
        if (truncatedNumber.length < 4) {
            return `(${truncatedNumber}`;
        } else if (truncatedNumber.length < 7) {
            return `(${truncatedNumber.substring(0, 3)}) ${truncatedNumber.substring(3)}`;
        } else {
            return `(${truncatedNumber.substring(0, 3)}) ${truncatedNumber.substring(3, 6)}-${truncatedNumber.substring(6)}`;
        }
    };

    // Handle phone number changes with formatting
    const handlePhoneChange = (event, setter) => {
        const formattedPhone = formatPhoneNumber(event.target.value);
        setter(prev => ({
            ...prev,
            phone: formattedPhone
        }));
    };

    // Validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle step navigation
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Function to render address form fields
    const renderAddressFields = (data, handleChange, handlePhoneChange, isShipping = true) => {
        return (
            <>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={data.firstName}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={data.lastName}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                <TextField
                    required
                    fullWidth
                    label="Address line 1: Street Address or P.O. Box"
                    name="addressLine1"
                    value={data.addressLine1}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Address line 2: Apt, Suite, building, floor, etc."
                    name="addressLine2"
                    value={data.addressLine2}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="City"
                            name="city"
                            value={data.city}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="state-select-label">State</InputLabel>
                            <Select
                                labelId="state-select-label"
                                id="state-select"
                                name="state"
                                value={data.state}
                                label="State"
                                onChange={handleChange}
                            >
                                {usStates.map(state => (
                                    <MenuItem key={state} value={state}>{state}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Zip Code"
                            name="zipCode"
                            value={data.zipCode}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                {isShipping && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                variant="outlined"
                                type="email"
                                error={data.email !== '' && !isValidEmail(data.email)}
                                helperText={data.email !== '' && !isValidEmail(data.email) ? "Please enter a valid email address" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={data.phone}
                                onChange={(e) => handlePhoneChange(e, isShipping ? setShippingData : setBillingData)}
                                variant="outlined"
                                placeholder="(XXX) XXX-XXXX"
                            />
                        </Grid>
                    </Grid>
                )}
            </>
        );
    };

    // Render shipping form or completed shipping section
    const renderShippingStep = () => {
        if (activeStep > 0) {
            return (
                <Collapse in={true} appear={true} timeout={500}>
                    <CompletedSection>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <GreenCheckCircle />
                            <Typography variant="h6">1. SHIPPING ADDRESS</Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                color="primary"
                                onClick={() => setActiveStep(0)}
                                sx={{ textTransform: 'none' }}
                            >
                                Edit
                            </Button>
                        </Box>
                        <Typography variant="body1">{shippingData.firstName} {shippingData.lastName}</Typography>
                        <Typography variant="body1">{shippingData.addressLine1}</Typography>
                        {shippingData.addressLine2 && <Typography variant="body1">{shippingData.addressLine2}</Typography>}
                        <Typography variant="body1">{shippingData.city}, {shippingData.state} {shippingData.zipCode}</Typography>
                        <Typography variant="body1">Email: {shippingData.email}</Typography>
                        <Typography variant="body1">Phone: {shippingData.phone}</Typography>
                    </CompletedSection>
                </Collapse>
            );
        }

        return (
            <>
                <SectionHeader>
                    <StepTitle variant="h6">1. SHIPPING DETAILS</StepTitle>
                </SectionHeader>

                <Card sx={{ mb: 4 }}>
                    <Collapse in={activeStep === 0} timeout={500} mountOnEnter unmountOnExit>
                        <CardContent>
                            {/* Address type selection - only show if user is logged in */}
                            {isUserLoggedIn && (
                                <FormControl component="fieldset" sx={{ mb: 3 }}>
                                    <RadioGroup
                                        row
                                        name="addressType"
                                        value={addressType}
                                        onChange={handleAddressTypeChange}
                                    >
                                        <FormControlLabel value="home" control={<Radio />} label="Saved address" />
                                        <FormControlLabel value="otheraddress" control={<Radio />} label="Different address" />
                                    </RadioGroup>
                                </FormControl>
                            )}

                            {renderAddressFields(shippingData, handleShippingChange, handlePhoneChange)}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <OrangeButton
                                    variant="contained"
                                    size="large"
                                    onClick={handleNext}
                                    disabled={!shippingData.firstName || !shippingData.lastName || !shippingData.addressLine1 ||
                                        !shippingData.city || !shippingData.state || !shippingData.zipCode ||
                                        !shippingData.email || !shippingData.phone || 
                                        (shippingData.email && !isValidEmail(shippingData.email))}
                                >
                                    CONTINUE
                                </OrangeButton>
                            </Box>
                        </CardContent>
                    </Collapse>
                </Card>
            </>
        );
    };

    const handleCardNumberChange = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 16) {
            value = value.slice(0, 16); // Limit to 16 digits
        }

        // Add spaces after every 4 digits
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');

        setPaymentData(prev => ({
            ...prev,
            cardNumber: formattedValue
        }));
    };

    // Add this handler function to your component
    const handleExpiryDateChange = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits

        if (value.length > 4) {
            value = value.slice(0, 4); // Limit to 4 digits
        }

        // Format as MM/YY
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }

        setPaymentData(prev => ({
            ...prev,
            expiryDate: value
        }));
    };

    const handleCvvChange = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits

        if (value.length > 3) {
            value = value.slice(0, 3); // Limit to 3 digits
        }

        setPaymentData(prev => ({
            ...prev,
            cvv: value
        }));
    };

    // Render payment form or completed payment section
    const renderPaymentStep = () => {
        if (activeStep < 1) {
            return null;
        }

        if (activeStep > 1) {
            return (
                <Collapse in={true} appear={true} timeout={500}>
                    <CompletedSection sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <GreenCheckCircle />
                            <Typography variant="h6">2. PAYMENT INFORMATION</Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                color="primary"
                                onClick={() => setActiveStep(1)}
                                sx={{ textTransform: 'none' }}
                            >
                                Edit
                            </Button>
                        </Box>
                        <Typography variant="body1">Card ending in {paymentData.cardNumber.slice(-4)}</Typography>
                        <Typography variant="body1">Name: {paymentData.nameOnCard}</Typography>
                        <Typography variant="body1">Expiry: {paymentData.expiryDate}</Typography>
                        <Typography variant="body1">Billing address: {paymentData.billingAddress === 'same' ? 'Same as shipping' : 'Different address'}</Typography>
                        
                        {paymentData.billingAddress === 'different' && (
                            <>
                                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>Billing Address:</Typography>
                                <Typography variant="body1">{billingData.firstName} {billingData.lastName}</Typography>
                                <Typography variant="body1">{billingData.addressLine1}</Typography>
                                {billingData.addressLine2 && <Typography variant="body1">{billingData.addressLine2}</Typography>}
                                <Typography variant="body1">{billingData.city}, {billingData.state} {billingData.zipCode}</Typography>
                            </>
                        )}
                    </CompletedSection>
                </Collapse>
            );
        }

        return (
            <>
                <SectionHeader>
                    <StepTitle variant="h6">2. PAYMENT INFORMATION</StepTitle>
                </SectionHeader>

                <Card sx={{ mb: 4 }}>
                    <Collapse in={activeStep === 1} timeout={500} mountOnEnter unmountOnExit>
                        <CardContent>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Card Number"
                                        name="cardNumber"
                                        value={paymentData.cardNumber}
                                        onChange={handleCardNumberChange} // Use custom handler instead of handlePaymentChange
                                        variant="outlined"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        inputProps={{ maxLength: 19 }} // 16 digits + 3 spaces
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Name on Card"
                                        name="nameOnCard"
                                        value={paymentData.nameOnCard}
                                        onChange={handlePaymentChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Expiry Date"
                                        name="expiryDate"
                                        value={paymentData.expiryDate}
                                        onChange={handleExpiryDateChange} // Use custom handler instead of handlePaymentChange
                                        variant="outlined"
                                        placeholder="MM/YY"
                                        inputProps={{ maxLength: 5 }} // MM/YY format (5 characters)
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="CVV"
                                        name="cvv"
                                        value={paymentData.cvv}
                                        onChange={handleCvvChange}
                                        variant="outlined"
                                        type="password"
                                        inputProps={{ maxLength: 3 }}
                                    />
                                </Grid>
                            </Grid>

                            <FormControl component="fieldset" sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>Billing Address</Typography>
                                <RadioGroup
                                    name="billingAddress"
                                    value={paymentData.billingAddress}
                                    onChange={handlePaymentChange}
                                >
                                    <FormControlLabel value="same" control={<Radio />} label="Same as shipping address" />
                                    <FormControlLabel value="different" control={<Radio />} label="Use a different billing address" />
                                </RadioGroup>
                            </FormControl>

                            {/* Show billing address form if "different" is selected */}
                            <Collapse in={paymentData.billingAddress === 'different'} timeout={500}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>Billing Address Details</Typography>
                                    {renderAddressFields(billingData, handleBillingChange, handlePhoneChange, false)}
                                </Box>
                            </Collapse>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <OrangeButton
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!paymentData.cardNumber || !paymentData.nameOnCard ||
                                        !paymentData.expiryDate || !paymentData.cvv || 
                                        (paymentData.billingAddress === 'different' && (
                                            !billingData.firstName || !billingData.lastName || 
                                            !billingData.addressLine1 || !billingData.city || 
                                            !billingData.state || !billingData.zipCode
                                        ))}
                                >
                                    CONTINUE
                                </OrangeButton>
                            </Box>
                        </CardContent>
                    </Collapse>
                </Card>
            </>
        );
    };

    // Render review order step
    const renderReviewStep = () => {
        if (activeStep < 2) {
            return null;
        }

        return (
            <>
                <SectionHeader>
                    <StepTitle variant="h6">3. REVIEW ORDER</StepTitle>
                </SectionHeader>

                <Card sx={{ mb: 4 }}>
                    <Collapse in={activeStep === 2} timeout={500} mountOnEnter unmountOnExit>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>

                            <Box sx={{ display: 'flex', mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'grey.300',
                                        mr: 2,
                                        flexShrink: 0
                                    }}
                                />
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Harry Potter: The Wizard Man
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ISBN: 420
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Type: Hardcover
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Qty: 1 @ $20.00
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Subtotal</Typography>
                                    <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Shipping</Typography>
                                    <Typography variant="body1">${shipping.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Tax</Typography>
                                    <Typography variant="body1">${tax.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>TOTAL</Typography>
                                    <Typography variant="body1" color="warning.main" sx={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="body2" sx={{ mb: 3 }}>
                                By placing your order, you agree to our <a href="#" style={{ color: '#1976d2' }}>Terms and Conditions</a> and <a href="#" style={{ color: '#1976d2' }}>Privacy Policy</a>.
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <OrangeButton
                                    variant="contained"
                                    size="large"
                                    onClick={() => {
                                        // This would submit the form to your backend
                                        alert('Order placed! Will integrate with backend when ready.');
                                    }}
                                >
                                    PLACE ORDER
                                </OrangeButton>
                            </Box>
                        </CardContent>
                    </Collapse>
                </Card>
            </>
        );
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Brand Logo
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalPhoneIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">1-800-806-6453</Typography>
                        </Box>
                        <IconButton aria-label="shopping bag">
                            <ShoppingBagIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    Checkout
                </Typography>

                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Grid container spacing={3}>
                    {/* Left column - Checkout steps */}
                    <Grid item xs={12} md={8}>
                        {renderShippingStep()}
                        {renderPaymentStep()}
                        {renderReviewStep()}
                    </Grid>

                    {/* Right column - Order summary */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#f5f5f5' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        ORDER SUMMARY
                                    </Typography>
                                    {activeStep < 2 && (
                                        <Button color="primary">Edit</Button>
                                    )}
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">Subtotal</Typography>
                                        <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">Estimated Shipping</Typography>
                                        <Typography variant="body1">${shipping.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">Estimated Tax</Typography>
                                        <Typography variant="body1">${tax.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>TOTAL</Typography>
                                        <Typography variant="body1" color="warning.main" sx={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    ARRIVES BY THU, JUN 24
                                </Typography>

                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            bgcolor: 'grey.300',
                                            mr: 2,
                                            flexShrink: 0
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            Harry Potter: The Wizard Man
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ISBN: 420
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Type: Hardcover
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Qty: 1 @ $20.00
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            $20.00
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Checkout;