import * as React from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Link,
  Alert,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useState } from 'react';
import employeeApi from '../api/employeeApi';

const providers = [{ id: 'credentials', name: 'Email and Password' }];


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/signup" variant="body2">
      Sign up
    </Link>
  );
}

function SignInAsCustomer() {
  return (
    <Link href="/login" variant="body2">
      Sign in as Customer
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Employee Login</h2>;
}

export default function SlotsSignIn() {
  const [error, setError] = useState(null);

  const signIn = async (provider, formData) => {
    try {
      const email = formData.get('email');
      const password = formData.get('password');

      const data = await employeeApi.login(email, password);

      if (data.success) {
        alert(data.Message || 'Logged in successfully');
        localStorage.setItem('authToken', data.token);
        window.location.href = '/EmployeePortal';
      } else {
        setError(data.Message);
        alert(data.Message || 'Login failed');
      }
    } catch (err) {
      setError(err.toString());
    }
  };

  return (

      <AppProvider theme={darkTheme}>
        <SignInPage
          signIn={signIn}
          slots={{
            title: Title,
            emailField: CustomEmailField,
            passwordField: CustomPasswordField,
            submitButton: CustomButton,
            signUpLink: SignUpLink,
            forgotPasswordLink: SignInAsCustomer,
          }}
          providers={providers}
        />
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
      </AppProvider>
  );
}
