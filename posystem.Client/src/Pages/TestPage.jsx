import { Box, Container, Typography } from '@mui/material';
import BookApiTest from './ManagementPage/components/Books/BookApiTest';

const TestPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          API Test Page
        </Typography>
        <Typography variant="body1" paragraph>
          Use this page to test the API connections directly without involving complex UI components.
        </Typography>
      </Box>
      
      <BookApiTest />
    </Container>
  );
};

export default TestPage; 