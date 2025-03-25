import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Box, Menu, MenuItem, Card, CardMedia, CardContent, TextField, Stack, Tooltip, IconButton, Typography, Grid } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SubjectIcon from '@mui/icons-material/Subject';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ScienceIcon from '@mui/icons-material/Science';
import StarRateIcon from '@mui/icons-material/StarRate';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import MoodIcon from '@mui/icons-material/Mood';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SchoolIcon from '@mui/icons-material/School';
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined';
import ToysOutlinedIcon from '@mui/icons-material/ToysOutlined';
import AddIcon from '@mui/icons-material/Add';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { useNavigate, Link } from 'react-router-dom';
import bookApi from '../api/bookApi';

// -----------------------------------------------------------------------------
// Navigation configuration (categories, etc.)
// -----------------------------------------------------------------------------
const NAVIGATION = [
  { kind: 'header', title: 'Categories' },
  { segment: 'fiction', title: 'Fiction', icon: <MenuBookIcon /> },
  { segment: 'non-fiction', title: 'Non-fiction', icon: <SubjectIcon /> },
  { segment: 'mystery', title: 'Mystery', icon: <AutoStoriesIcon /> },
  { segment: 'romance', title: 'Romance', icon: <StarRateIcon /> },
  { segment: 'science-fiction', title: 'Science Fiction', icon: <ScienceIcon /> },
  { segment: 'fantasy', title: 'Fantasy', icon: <MoodIcon /> },
  { segment: 'biography', title: 'Biography', icon: <LocalLibraryIcon /> },
  { segment: 'history', title: 'History', icon: <HistoryEduIcon /> },
  { segment: 'self-help', title: 'Self-Help', icon: <PsychologyIcon /> },
  { segment: 'poetry', title: 'Poetry', icon: <SchoolIcon /> },
  { segment: 'thriller', title: 'Thriller', icon: <WhatshotIcon /> },
  { segment: 'young-adult', title: 'Young Adult', icon: <PsychologyAltIcon /> },
];

// -----------------------------------------------------------------------------
// Theme (using the UI styling from the first snippet)
// -----------------------------------------------------------------------------
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// -----------------------------------------------------------------------------
// ToolbarActionsSearch
// (This component now accepts searchTerm and setSearchTerm as props so that the
// search input value is lifted to Marketplace state.)
// -----------------------------------------------------------------------------
function ToolbarActionsSearch({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{ display: { xs: "inline", md: "none" } }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>

      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{
          flexGrow: 1,
          mr: 40,
          maxWidth: "700px",
          minWidth: "500px",
        }}
      />

      <Tooltip title="Account">
        <IconButton color="primary" onClick={handleAccountMenuClick}>
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleAccountMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {isLoggedIn ? (
          <>
            <MenuItem component={Link} to="/account">Account Details</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/login">Login</MenuItem>
            <MenuItem component={Link} to="/signup">Signup</MenuItem>
          </>
        )}
      </Menu>

      <Tooltip title="Shopping Cart">
        <IconButton
          color="primary"
          onClick={() => {
            if (!isLoggedIn) {
              alert("Please create an account to view the cart.");
            } else {
              navigate("/cart");
            }
          }}
        >
          <ShoppingCartIcon />
        </IconButton>
      </Tooltip>

      <ThemeSwitcher />
    </Stack>
  );
}

ToolbarActionsSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

// -----------------------------------------------------------------------------
// PageContent
// (This component now fetches books from the database based on the current searchTerm.)
// -----------------------------------------------------------------------------
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

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        Featured
      </Typography>
      {loading && (
        <Typography variant="body1" align="center">Loading...</Typography>
      )}
      {error && (
        <Typography variant="body1" align="center" color="error">{error}</Typography>
      )}
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card
              sx={{
                width: "100%",
                height: 300,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                mx: "auto",
                boxShadow: 3,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                '&:hover': {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={book.coverImage ? `data:image/jpeg;base64,${book.coverImage}` : "https://via.placeholder.com/300"}
                alt={book.title}
                sx={{ objectFit: "contain", height: 200, backgroundColor: "#f5f5f5" }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>{book.title}</Typography>
                <Typography variant="body1" color="primary">
                  ${book.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

PageContent.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};

// -----------------------------------------------------------------------------
// Main Marketplace Component
// (This wraps the DashboardLayout from Toolpad and holds the searchTerm state.)
// -----------------------------------------------------------------------------
function Marketplace(props) {
  const { window } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const router = useDemoRouter('/page');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ title: 'Cougar Catalog', logo: <img src="/logo.png" alt="png" /> }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => (
            <ToolbarActionsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )
        }}
      >
        <PageContent searchTerm={searchTerm} />
      </DashboardLayout>
    </AppProvider>
  );
}

Marketplace.propTypes = {};

export default Marketplace;
