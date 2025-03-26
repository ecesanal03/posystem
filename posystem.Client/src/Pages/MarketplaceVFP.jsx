import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import bookApi from '../api/bookApi';

// ======================================================
// CATEGORIES CONFIGURATION
// ======================================================
const CATEGORIES = [
  {
    segment: 'fiction',
    title: 'Fiction',   
  },
  {
    segment: 'non-fiction',
    title: 'Non-fiction',
  },
  {
    segment: 'mystery',
    title: 'Mystery',
  },
  {
    segment: 'romance',
    title: 'Romance',
  },
  {
    segment: 'science-fiction',
    title: 'Sci-Fi',
  },
  {
    segment: 'fantasy',
    title: 'Fantasy',
  },
  {
    segment: 'biography',
    title: 'Biography',
  },
  {
    segment: 'history',
    title: 'History',
  },
  {
    segment: 'self-help',
    title: 'Self-Help',
  },
  {
    segment: 'poetry',
    title: 'Poetry',
  },
  {
    segment: 'thriller',
    title: 'Thriller',
  },
  {
    segment: 'young-adult',
    title: 'Young Adult',
  },
];

// ======================================================
// COMMON STYLES
// ======================================================
const COMMON_STYLES = {
  maxWidthContainer: {
    maxWidth: { md: '1200px' },
    mx: 'auto',
    width: '100%',
  },
  headerBackground: {
    backgroundColor: 'white',
  },
  linkText: {
    textDecoration: 'none',
    color: 'text.primary',
    fontWeight: 500,
  },
};

// ======================================================
// THEME CONFIGURATION
// ======================================================
const theme = createTheme({
  typography: {
    fontFamily: [
      '"Source Sans Pro"',
      'Lato',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontFamily: 'Baskerville, "Libre Baskerville", Georgia, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Baskerville, "Libre Baskerville", Georgia, serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Source Sans Pro", Lato, sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: 'Roboto, "Segoe UI", sans-serif',
      textTransform: 'none',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Source Sans Pro", Lato, sans-serif',
    },
    body2: {
      fontFamily: '"Source Sans Pro", Lato, sans-serif',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// ======================================================
// HEADER COMPONENT WITH CATEGORIES NAVIGATION
// ======================================================
function Header({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  
  // Check if the user is logged in
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Trigger search
      setSearchTerm(event.target.value);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Bar - Account & Notifications */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          px: 3,
          pt: 0.75,
          borderColor: 'divider',
          ...COMMON_STYLES.maxWidthContainer,
          ...COMMON_STYLES.headerBackground,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography 
            component={Link}
            to={isLoggedIn ? "/account" : "/login"}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ...COMMON_STYLES.linkText,
              fontSize: '0.875rem'
            }}
          >
            <AccountCircleIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
            Account
          </Typography>
          <Typography
            component={Link}
            to="/notifications"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ...COMMON_STYLES.linkText,
              fontSize: '0.875rem'
            }}
          >
            <NotificationsIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
            Notifications
          </Typography>
        </Box>
      </Box>
      
      {/* Logo and Search Bar */}
      <Box 
        sx={{
          py: 2, 
          ...COMMON_STYLES.maxWidthContainer,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          ...COMMON_STYLES.headerBackground,
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 3
          }}
        >
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              color: '#4335A7',
              textDecoration: 'none',
              mr: 2
            }}
          >
            CougarCatalogue
          </Typography>
          <Box
            component="img"
            src="/logo.png"
            alt="Pixel Art Logo"
            sx={{
              height: 40,
              width: 40,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </Box>
        
        {/* SEARCH AND CART */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flex: 1,
          maxWidth: '900px'
        }}>
          <TextField
            placeholder="Search by Title, Author, or ISBN"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            sx={{ mr: 4 }}
            InputProps={{
              endAdornment: (
                <IconButton 
                  edge="end" 
                  size="small"
                  onClick={() => setSearchTerm(searchTerm)}
                >
                  <SearchIcon sx={{ fontSize: 20 }} />
                </IconButton>
              ),
              sx: { 
                border: '1px solid #674188',
                borderRadius: 2,
                height: 32,
                bgcolor: 'white',
                color: '#674188'
              }
            }}
          />
          
          <IconButton
            color="inherit"
            onClick={() => {
              if (!isLoggedIn) {
                alert("Please create an account to view the cart.");
              } else {
                navigate("/cart");
              }
            }}
            sx={{ ml: 2 }}
          >
            <ShoppingCartIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      {/* CATEGORIES NAVIGATION */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 1.5,
          px: 3,
          ...COMMON_STYLES.maxWidthContainer,
          ...COMMON_STYLES.headerBackground,
        }}
      >
        {/* Desktop Categories - Horizontal List */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            width: '100%',
            flexWrap: 'wrap'
          }}
        >
          {CATEGORIES.map((category, index) => (
            <React.Fragment key={category.segment}>
              <Typography
                component={Link}
                to={`/category/${category.segment}`}
                sx={{
                  ...COMMON_STYLES.linkText,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {category.title}
              </Typography>
              {index < CATEGORIES.length - 1 && (
                <Typography sx={{ color: 'text.secondary' }}>|</Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

Header.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired
};

// ======================================================
// MAIN CONTENT AREA
// Contains product grid and featured section
// ======================================================
function PageContent({ searchTerm }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookApi.getBooks({
          SearchTerm: searchTerm,
          SortBy: 'Added_At',
          SortDesc: true,
          Skip: 0,
          Take: 12
        });
        
        setBooks(response.books || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm]);

  const renderProductCard = (book) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        mb: 2,
        position: "relative"
      }}
    >
      {/* PRODUCT IMAGE */}
      <Box
        component={Link}
        to={`/product/${book.id}`}
        sx={{
          position: "relative",
          height: 260,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
          }
        }}
      >
        <Box
          component="img"
          src={book.coverImage ? `data:image/jpeg;base64,${book.coverImage}` : "https://placehold.co/200x300/e9e2f1/674188?text=Book+Cover"}
          alt={book.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/200x300/e9e2f1/674188?text=CougarCatalogue";
          }}
          sx={{
            objectFit: "contain",
            height: "100%",
            width: "auto",
            maxWidth: "100%",
            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
          }}
        />
      </Box>
      
      {/* PRODUCT DETAILS */}
      <Box>
        <Typography 
          component={Link}
          to={`/product/${book.id}`}
          sx={{ 
            fontWeight: 600, 
            color: "#333", 
            display: "block",
            fontSize: "0.95rem",
            textDecoration: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
            maxWidth: "calc(100% - 2%)",
            "&:hover": {
              textDecoration: "underline",
            }
          }}
          title={book.title}
        >
          {book.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#888",
              fontStyle: "italic",
              fontFamily: 'Georgia, serif',
              fontSize: "0.8rem",
              fontWeight: 400,
              mr: 0.5
            }}
          >
            by
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#674188", 
              fontSize: "0.85rem",
              fontStyle: "italic",
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.02em',
              fontWeight: 400
            }}
            title={book.author}
          >
            {book.author}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="subtitle1" 
            sx={{
              fontWeight: 600,
              mt: 0.5
            }}
          >
            ${book.price.toFixed(2)}
          </Typography>
          <Typography
            variant="subtitle1" 
            sx={{
              color: book.units > 0 ? "#674188" : "#d32f2f",
              fontWeight: 200,
              mt: 0.5,
              fontSize: "0.75rem",
              opacity: 0.85,
              letterSpacing: '0.02em',
              ml: 0.5
            }}
          >
            {book.units > 0 ? "Available" : "Out of Stock"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box 
      elevation={3}
      sx={{ 
        ...COMMON_STYLES.maxWidthContainer,
        px: 3,
        pt: 4,
        pb: 4
      }}
    >
      {/* FEATURED SECTION HEADER */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ textAlign: "left", mb: 3, color: 'black' }}
      >
        Featured
      </Typography>
      
      {/* LOADING STATE */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ERROR STATE */}
      {error && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {/* EMPTY STATE */}
      {!loading && !error && books.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography>No Books or Cant connect to the server.</Typography>
        </Box>
      )}
      
      {/* PRODUCT GRID CONTAINER */}
      {!loading && !error && books.length > 0 && (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid xs={6} sm={4} md={4} lg={2} key={book.id}>
              {renderProductCard(book)}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

PageContent.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};

// ======================================================
// MAIN MARKETPLACE COMPONENT
// ======================================================
function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* --- HEADER WITH CATEGORIES --- */}
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* --- MAIN CONTENT AREA --- */}
        <Box component="main" sx={{ flexGrow: 1, pb: 4 }}>
          <PageContent searchTerm={searchTerm} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

Marketplace.propTypes = {};

export default Marketplace;