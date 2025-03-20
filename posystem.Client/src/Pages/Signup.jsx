import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


// preview-start
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// preview-end

// const signIn = async (provider, formData) => {
//   const promise = new Promise((resolve) => {
//     setTimeout(() => {
//       alert(
//         `Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}`,
//       );
//       resolve();
//     }, 300);
//   });
//   return promise;
// };

export default function CredentialsSignInPage() {
  const theme = useTheme();
  const navigate = useNavigate()

  const handleSignIn = async (provider, formData) => {
    // Get the email and password from the form data
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    navigate('/create-account', { state: { email, password } });
  };

  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
        }}
      >
      </SignInPage>
    </AppProvider>
    // preview-end
  );
}

