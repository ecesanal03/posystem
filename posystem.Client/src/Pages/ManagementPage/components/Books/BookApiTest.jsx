import { useState } from 'react';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import bookApi from '../../../../api/bookApi';

const BookApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [testBookId, setTestBookId] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Sample test book data
  const testBook = {
    title: 'Test Book',
    author: 'Test Author',
    isbn: `TEST-${Date.now().toString().slice(-6)}`,
    price: 19.99,
    units: 10,
    description: 'This is a test book created for API testing.'
  };

  const testGetBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookApi.getBooks();
      setResults(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookApi.createBook(testBook);
      setResults(JSON.stringify(response, null, 2));
      
      // If successful and we got an ID back, save it for testing other operations
      if (response?.book?.id) {
        setTestBookId(response.book.id);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetBook = async () => {
    if (!testBookId) {
      setError('No book ID available. Please create a book first or enter an ID.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await bookApi.getBook(testBookId);
      setResults(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateBook = async () => {
    if (!testBookId) {
      setError('No book ID available. Please create a book first or enter an ID.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const updatedBook = {
        ...testBook,
        title: `${testBook.title} (Updated)`,
        units: testBook.units + 5
      };
      
      const response = await bookApi.updateBook(testBookId, updatedBook);
      setResults(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDeleteBook = async () => {
    if (!testBookId) {
      setError('No book ID available. Please create a book first or enter an ID.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await bookApi.deleteBook(testBookId);
      setResults(JSON.stringify(response, null, 2));
      if (response.success) {
        setTestBookId(''); // Clear ID if delete was successful
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookIdChange = (e) => {
    setTestBookId(e.target.value);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2, bgcolor: '#2A2D2A', color: 'white' }}>
      <Typography variant="h5" gutterBottom>
        Book API Test Panel
      </Typography>
      <Typography variant="subtitle1" color="info.main" paragraph>
        This panel helps test the direct connection between frontend and backend.
      </Typography>
      
      <Divider sx={{ my: 2, bgcolor: '#61677A' }} />
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Test Book ID"
            value={testBookId}
            onChange={handleBookIdChange}
            placeholder="Enter a book ID or create a book to get an ID"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1E201E',
                color: 'white',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#61677A'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#D8D9DA'
              }
            }}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await bookApi.testConnection();
              setResults(JSON.stringify(response, null, 2));
            } catch (err) {
              setError(`Error: ${err.message}`);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
        >
          Test CORS Connection
        </Button>
        
        <Button 
          variant="contained" 
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              // Try a simple GET request (often less strict than OPTIONS)
              const response = await fetch('https://localhost:5001/books', {
                headers: {
                  'Accept': 'application/json'
                }
              });
              
              // Check if response is OK
              if (!response.ok) {
                throw new Error(`Status: ${response.status} ${response.statusText}`);
              }
              
              // Check content type header to see if we're getting JSON back
              const contentType = response.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                // Log the first 100 characters of the response for debugging
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 100) + '...');
                throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
              }
              
              // Parse the response as JSON
              const data = await response.json();
              setResults(JSON.stringify({
                success: true,
                method: 'Direct GET',
                status: response.status,
                contentType,
                data
              }, null, 2));
            } catch (err) {
              console.error('Direct GET error:', err);
              setResults(JSON.stringify({
                success: false,
                method: 'Direct GET',
                error: err.message,
                suggestion: 'Try accessing https://localhost:5001/books directly in your browser to verify the API is working correctly.'
              }, null, 2));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
        >
          Direct GET Test
        </Button>
        
        <Button 
          variant="contained" 
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              // Try HTTP version of the API
              const response = await fetch('http://localhost:54904/books', {
                headers: {
                  'Accept': 'application/json'
                }
              });
              
              if (!response.ok) {
                throw new Error(`Status: ${response.status} ${response.statusText}`);
              }
              
              const contentType = response.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 100) + '...');
                throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
              }
              
              const data = await response.json();
              setResults(JSON.stringify({
                success: true,
                method: 'HTTP GET (port 54904)',
                status: response.status,
                contentType,
                data
              }, null, 2));
            } catch (err) {
              console.error('HTTP GET error:', err);
              setResults(JSON.stringify({
                success: false,
                method: 'HTTP GET (port 54904)',
                error: err.message
              }, null, 2));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{ bgcolor: '#ed6c02', '&:hover': { bgcolor: '#c56000' } }}
        >
          HTTP Test (Port 54904)
        </Button>
        
        <Button 
          variant="contained" 
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              // Try to access the root endpoint, which often returns info about the API
              const urls = [
                'https://localhost:5001',
                'http://localhost:54904'
              ];
              
              let success = false;
              let result = {};
              
              for (const url of urls) {
                try {
                  const response = await fetch(url);
                  const contentType = response.headers.get('content-type');
                  
                  let data;
                  if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                  } else {
                    data = await response.text();
                  }
                  
                  result = {
                    success: true,
                    method: `Root endpoint (${url})`,
                    status: response.status,
                    contentType,
                    data
                  };
                  success = true;
                  break;
                } catch (err) {
                  console.log(`Failed to connect to ${url}:`, err);
                }
              }
              
              if (!success) {
                throw new Error('Could not connect to any server endpoint');
              }
              
              setResults(JSON.stringify(result, null, 2));
            } catch (err) {
              setResults(JSON.stringify({
                success: false,
                method: 'Root endpoint check',
                error: err.message,
                suggestion: 'Make sure your server is running and accessible'
              }, null, 2));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{ bgcolor: '#9c27b0', '&:hover': { bgcolor: '#7b1fa2' } }}
        >
          Check Server Info
        </Button>
        
        <Button 
          variant="contained" 
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              // Use the comprehensive server status check
              const status = await bookApi.checkServerStatus();
              setResults(JSON.stringify(status, null, 2));
            } catch (err) {
              setError(`Error: ${err.message}`);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{ bgcolor: '#5d4037', '&:hover': { bgcolor: '#3e2723' } }}
        >
          Comprehensive Status Check
        </Button>
        
        <Button 
          variant="contained" 
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              // Detect and display server configuration details
              const details = await bookApi.detectServerDetails();
              setResults(JSON.stringify(details, null, 2));
            } catch (err) {
              setError(`Error: ${err.message}`);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{ bgcolor: '#00838f', '&:hover': { bgcolor: '#006064' } }}
        >
          Detect Server Configuration
        </Button>
        
        <Button 
          variant="contained" 
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              // This test will help diagnose why we're getting HTML instead of JSON
              const url = 'https://localhost:5001/books';
              
              // First make an OPTIONS request to check CORS and accepted content types
              const optionsResponse = await fetch(url, {
                method: 'OPTIONS',
                headers: {
                  'Origin': window.location.origin,
                  'Access-Control-Request-Method': 'GET'
                }
              }).catch(err => ({ error: err.message }));
              
              // Then make a HEAD request to check headers without fetching body
              const headResponse = await fetch(url, {
                method: 'HEAD',
                headers: {
                  'Accept': 'application/json'
                }
              }).catch(err => ({ error: err.message }));
              
              // Finally make a GET request with explicit Accept header
              const getResponse = await fetch(url, {
                headers: {
                  'Accept': 'application/json'
                }
              }).catch(err => ({ error: err.message }));
              
              // Gather content type information
              let contentType = null;
              let responseText = null;
              
              if (getResponse && !getResponse.error) {
                contentType = getResponse.headers?.get('content-type');
                try {
                  if (contentType && contentType.includes('application/json')) {
                    await getResponse.json(); // Just to validate it's valid JSON
                    responseText = 'Valid JSON response';
                  } else {
                    responseText = await getResponse.text();
                    responseText = responseText.substring(0, 200) + '...'; // Limit length
                  }
                } catch (err) {
                  responseText = `Error parsing response: ${err.message}`;
                }
              }
              
              const results = {
                success: !!(getResponse && !getResponse.error && contentType?.includes('application/json')),
                method: 'API Schema Test',
                options: optionsResponse.error || {
                  status: optionsResponse.status,
                  contentType: optionsResponse.headers?.get('content-type'),
                  allowOrigin: optionsResponse.headers?.get('access-control-allow-origin'),
                  allowMethods: optionsResponse.headers?.get('access-control-allow-methods')
                },
                head: headResponse.error || {
                  status: headResponse.status,
                  contentType: headResponse.headers?.get('content-type')
                },
                get: getResponse.error || {
                  status: getResponse.status,
                  contentType: contentType,
                  responsePreview: responseText
                },
                suggestions: []
              };
              
              // Add suggestions based on findings
              if (getResponse.error) {
                results.suggestions.push('Server is not responding to GET requests.');
              } else if (!contentType) {
                results.suggestions.push('Server response is missing Content-Type header.');
              } else if (!contentType.includes('application/json')) {
                results.suggestions.push('Server is not returning JSON. Check the response preview for clues.');
                results.suggestions.push('Make sure your API endpoint is configured to return JSON by default.');
              }
              
              setResults(JSON.stringify(results, null, 2));
            } catch (err) {
              setResults(JSON.stringify({
                success: false,
                method: 'API Schema Test',
                error: err.message
              }, null, 2));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
        >
          API Content-Type Test
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testGetBooks}
          disabled={loading}
          sx={{ bgcolor: '#61677A', '&:hover': { bgcolor: '#6D7386' } }}
        >
          GET /books
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testCreateBook}
          disabled={loading}
          sx={{ bgcolor: '#61677A', '&:hover': { bgcolor: '#6D7386' } }}
        >
          POST /books
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testGetBook}
          disabled={loading || !testBookId}
          sx={{ bgcolor: '#61677A', '&:hover': { bgcolor: '#6D7386' } }}
        >
          GET /books/{'{id}'}
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testUpdateBook}
          disabled={loading || !testBookId}
          sx={{ bgcolor: '#61677A', '&:hover': { bgcolor: '#6D7386' } }}
        >
          PUT /books/{'{id}'}
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testDeleteBook}
          disabled={loading || !testBookId}
          sx={{ color: 'white', bgcolor: '#ff6b6b', '&:hover': { bgcolor: '#ff4f4f' } }}
        >
          DELETE /books/{'{id}'}
        </Button>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        {loading && <CircularProgress />}
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        {results && (
          <Paper elevation={3} sx={{ p: 2, mt: 2, position: 'relative', maxHeight: '500px', overflow: 'auto' }}>
            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
                onClick={() => {
                  navigator.clipboard.writeText(results);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Box>
            <Typography variant="h6" gutterBottom>
              Test Results
            </Typography>
            <pre style={{ marginTop: 10, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
              {results}
            </pre>
            
            {/* Display suggestions if there are any */}
            {(() => {
              try {
                const parsedResults = JSON.parse(results);
                if (parsedResults.suggestions || parsedResults.suggestion) {
                  const suggestions = parsedResults.suggestions || 
                    (parsedResults.suggestion ? [parsedResults.suggestion] : []);
                  
                  if (suggestions.length > 0) {
                    return (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Suggestions:
                        </Typography>
                        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                          {suggestions.map((suggestion, index) => (
                            <li key={index}>
                              <Typography variant="body2">{suggestion}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    );
                  }
                }
                
                // Display success status
                if (parsedResults.success === true) {
                  return (
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label="Connection Successful" 
                        color="success" 
                        icon={<CheckCircleOutlineIcon />} 
                      />
                    </Box>
                  );
                } else if (parsedResults.success === false) {
                  return (
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label="Connection Failed" 
                        color="error" 
                      />
                    </Box>
                  );
                }
                
                return null;
              } catch {
                return null;
              }
            })()}
          </Paper>
        )}
      </Box>
    </Paper>
  );
};

export default BookApiTest; 