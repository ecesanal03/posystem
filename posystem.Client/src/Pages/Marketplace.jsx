import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Box, Menu, MenuItem, Card, CardMedia, CardContent, TextField, Stack, Tooltip, IconButton, Typography, Grid, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  TextareaAutosize,
  Rating,
  Badge,
 } from '@mui/material';
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { useNavigate, Link } from 'react-router-dom';
import bookApi from '../api/bookApi';
import cartApi from '../api/cartApi';
import notificationApi from '../api/notificationApi';

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
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  const handleAccountMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleAccountMenuClose = () => setAnchorEl(null);

  const handleNotifClick = async (event) => {
    setNotifAnchorEl(event.currentTarget);

    if (isLoggedIn) {
      try {
        const data = await notificationApi.getNotifications();
        setNotifications(data.results || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }
  };

  const handleNotifClose = () => setNotifAnchorEl(null);

  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Stack direction="row" >
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
          mr: 30,
          maxWidth: "700px",
          minWidth: "500px",
        }}
      />

      <Tooltip title="Notifications">
        <IconButton color="primary" onClick={handleNotifClick}>
          <Badge
            badgeContent={notifications.filter(n => !n.is_Read).length}
            color="error"
            overlap="circular"
            invisible={notifications.filter(n => !n.is_Read).length === 0}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={notifAnchorEl}
        open={notifOpen}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 1 }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>No new notifications</MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={() => {
                notificationApi.markNotificationAsRead(notif.id);
                handleNotifClose();
              }}
            >
              {notif.message}
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Account & Cart buttons below */}
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
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

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

  const handleBookClick = (book) => {
    setSelectedBook(book);
    // TODO: Fetch real reviews via API if needed
    setReviews([
      { user: "Alice", content: "Amazing book!" },
      { user: "Bob", content: "Loved the character development." }
    ]);
    setShowDialog(true);
  };
  
  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedBook(null);
    setNewReview('');
  };
  
  const handleAddReview = () => {
    if (newReview.trim()) {
      setReviews(prev => [...prev, { user: "You", content: newReview }]);
      setNewReview('');
    }
  };

  const handleAddToCart = async () => {
    try {
      await cartApi.addToCart(selectedBook.id, 1);
      alert("Book added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Could not add book to cart.");
    }
  };

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
              onClick={() => handleBookClick(book)}
              sx={{
                width: "100%",
                height: 320,
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
                image={book.CoverImage || "/defaultbookcover.png"}
                alt={book.title}
                sx={{ objectFit: "contain", height: 200, backgroundColor: "#f5f5f5" }}
              />
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
                overflow: 'hidden',
                alignItems: 'center',
                textAlign: 'center',
                p: 1.5
              }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 600,
                    fontSize: 14,
                    minHeight: '3em',
                  }}
                >
                  {book.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 'bold', mt: 1 }}
                >
                  ${book.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={showDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 22 }}>
          {selectedBook?.title}
        </DialogTitle>

        <DialogContent dividers>

          {/* Book Info Section */}
          <Box display="flex" gap={3} mb={3}>
            <Avatar
              variant="square"
              src={
                selectedBook?.CoverImage
                  ? `data:image/jpeg;base64,${selectedBook.CoverImage}`
                  : '/defaultbookcover.png'
              }
              sx={{
                width: 130,
                height: 180,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: '#f0f0f0',
              }}
            />
            <Box>
              <Typography variant="subtitle1" gutterBottom><strong>Author:</strong> {selectedBook?.author}</Typography>
              <Typography variant="subtitle1" gutterBottom><strong>Price:</strong> ${selectedBook?.price?.toFixed(2)}</Typography>
              <Typography variant="subtitle1" gutterBottom><strong>Publisher:</strong> {selectedBook?.supplierName || 'Unknown'}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Description Section */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedBook?.description || 'No description available.'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Reviews Section */}
          <Box>
            <Typography variant="h6" gutterBottom>Reviews</Typography>

            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
            ) : (
              <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, px: 1 }}>
                {reviews.map((review, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">{review.user}</Typography>
                    <Rating value={review.rating || 0} readOnly size="small" sx={{ mb: 0.5 }} />
                    <Typography variant="body2">{review.content}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Review input */}
            <TextareaAutosize
              minRows={3}
              placeholder="Write a review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 6,
                border: '1px solid #ccc',
                fontFamily: 'inherit',
                marginBottom: 10,
                marginTop: 10
              }}
            />

            {/* Optional: user rating before submitting */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Rating
                name="user-rating"
                value={reviewRating}
                onChange={(e, newValue) => setReviewRating(newValue)}
              />
              <Button variant="outlined" size="small" onClick={handleAddReview}>
                Submit Review
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ fontWeight: 'bold', px: 3 }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
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
