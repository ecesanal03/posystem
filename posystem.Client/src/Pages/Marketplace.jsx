import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Box, Menu, MenuItem, Card, CardMedia, CardContent, TextField, Stack, Tooltip, IconButton, Typography, Grid, Dialog,
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SubjectIcon from '@mui/icons-material/Subject';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ScienceIcon from '@mui/icons-material/Science';
import StarRateIcon from '@mui/icons-material/StarRate';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
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
import reviewApi from '../api/reviewApi';

// -----------------------------------------------------------------------------
// Navigation configuration (categories, etc.)
// -----------------------------------------------------------------------------
const NAVIGATION = [
  { kind: 'header', title: 'Categories' },
  { segment: 'featured', title: 'Featured', icon: <DashboardIcon /> },
  { segment: 'fiction', title: 'Fiction', icon: <MenuBookIcon /> },
  { segment: 'non-fiction', title: 'Non-fiction', icon: <SubjectIcon /> },
  { segment: 'mystery', title: 'Mystery', icon: <QuestionMarkIcon /> },
  { segment: 'romance', title: 'Romance', icon: <FavoriteIcon /> },
  { segment: 'science-fiction', title: 'Science Fiction', icon: <ScienceIcon /> },
  { segment: 'fantasy', title: 'Fantasy', icon: <AutoFixNormalIcon /> },
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
  // Local state for input handling
  const [inputValue, setInputValue] = useState(searchTerm);
  // State for suggestions
  const [suggestions, setSuggestions] = useState([]);
  // State to track if suggestions are visible
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Create a ref for the search input
  const searchInputRef = React.useRef(null);

  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  // Effect to sync input with searchTerm prop
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

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

  // Fetch suggestions as user types
  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      // Fetch a small number of suggestions
      const response = await bookApi.getBooks({
        SearchTerm: value,
        Take: 10 // Limit to 10 suggestions
      });

      setSuggestions(response.books || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  // Handle input change
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // If the search input is cleared, reset the search results
    if (!newValue.trim()) {
      setSearchTerm('');
    }

    // Fetch suggestions as user types
    fetchSuggestions(newValue);

    // Show suggestions panel
    if (newValue.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search submission (on Enter key)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(inputValue);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.title);
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

      <Box sx={{ position: 'relative', flexGrow: 1 }} ref={searchInputRef}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={handleSearchChange}
          onKeyPress={handleSearchSubmit}
          placeholder="Press Enter to search"
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  type="button"
                  aria-label="search"
                  size="small"
                  onClick={() => {
                    if (inputValue.trim()) {
                      setSearchTerm(inputValue);
                    } else {
                      setSearchTerm('');
                    }
                    setShowSuggestions(false);
                  }}
                >
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

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              maxWidth: "700px",
              mt: 0.5,
              zIndex: 1000,
              maxHeight: '300px',
              overflow: 'auto',
              boxShadow: 3,
              bgcolor: 'background.paper',
              borderRadius: 1
            }}
          >
            {suggestions.map((suggestion) => (
              <Box
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}
              >
                {suggestion.CoverImage && (
                  <Box
                    component="img"
                    src={suggestion.CoverImage}
                    alt={suggestion.title}
                    sx={{
                      width: 40,
                      height: 60,
                      objectFit: 'contain',
                      mr: 2,
                    }}
                    onError={(e) => {
                      e.target.src = "/defaultbookcover.png";
                    }}
                  />
                )}
                <Box>
                  <Typography variant="subtitle2">{suggestion.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    by {suggestion.author}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

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
function PageContent({ searchTerm, selectedCategory }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 12;
  const isFeatured = !selectedCategory;

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  useEffect(() => {
    // Modify the fetchBooks function in your useEffect
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookApi.getBooks({
          SearchTerm: searchTerm,
          Category: selectedCategory,
          SortBy: 'Added_At',
          SortDesc: true,
          Skip: (currentPage - 1) * booksPerPage,
          Take: booksPerPage
        });

        setBooks(response.books || []);
        // Calculate total pages based on the total count returned from API
        setTotalPages(Math.ceil(response.totalCount / booksPerPage));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    try {
      const reviewData = await reviewApi.getReviews(book.id);
      setReviews(reviewData.reviews || []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedBook(null);
    setNewReview('');
  };

  const handleAddReview = async () => {
    if (!newReview.trim() || reviewRating === 0) {
      alert("Please enter a review and rating.");
      return;
    }

    try {
      const response = await reviewApi.createReview(
        selectedBook.id,
        reviewRating,
        newReview.trim()
      );

      if (response.result === "Success") {
        // Reload reviews after posting
        const updatedReviews = await reviewApi.getReviews(selectedBook.id);
        setReviews(updatedReviews.reviews || []);
        setNewReview('');
        setReviewRating(0);
      } else {
        alert(response.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Error submitting review.");
    }
  };


  const handleAddToCart = async () => {
    try {
      const discountId = selectedBook.discountId || selectedBook.Discount_Id || null;
  
      await cartApi.addToCart(selectedBook.id, 1, discountId);
  
      alert("Book added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Could not add book to cart.");
    }
  };
  

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        {selectedCategory ? `${selectedCategory} Books` : "Featured"}
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
                image={book.CoverImage || book.Cover_Image || "/defaultbookcover.png"}
                alt={book.title}
                onError={(e) => {
                  console.error("Failed to load image for book:", {
                    title: book.title,
                    imageUrl: book.CoverImage || book.Cover_Image,
                    fallbackUsed: !book.CoverImage && !book.Cover_Image
                  });
                  e.target.src = "/defaultbookcover.png";
                }}
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

                {book.discountPercentage ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'line-through', color: '#888' }}
                  >
                    ${book.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    ${(book.price * (1 - book.discountPercentage / 100)).toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  ${book.price.toFixed(2)}
                </Typography>
              )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Enhanced pagination with accessible first/last page */}
      {!loading && books.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Previous button */}
            <Button
              size="small"
              variant="outlined"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Prev
            </Button>

            {/* First page is always visible */}
            <Button
              size="small"
              variant={currentPage === 1 ? "contained" : "outlined"}
              onClick={() => setCurrentPage(1)}
              sx={{ minWidth: '36px' }}
            >
              1
            </Button>

            {/* Ellipsis after first page if there's a gap */}
            {currentPage > 3 && (
              <Typography variant="body2" sx={{ mx: 0.5 }}>...</Typography>
            )}

            {/* Page before current (if not first page) */}
            {currentPage > 2 && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCurrentPage(currentPage - 1)}
                sx={{ minWidth: '36px' }}
              >
                {currentPage - 1}
              </Button>
            )}

            {/* Current page (if not first or last) */}
            {currentPage !== 1 && currentPage !== totalPages && (
              <Button
                size="small"
                variant="contained"
                sx={{ minWidth: '36px' }}
              >
                {currentPage}
              </Button>
            )}

            {/* Page after current (if not last page) */}
            {currentPage < totalPages - 1 && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCurrentPage(currentPage + 1)}
                sx={{ minWidth: '36px' }}
              >
                {currentPage + 1}
              </Button>
            )}

            {/* Ellipsis before last page if there's a gap */}
            {currentPage < totalPages - 2 && (
              <Typography variant="body2" sx={{ mx: 0.5 }}>...</Typography>
            )}

            {/* Last page is always visible (if more than 1 page) */}
            {totalPages > 1 && (
              <Button
                size="small"
                variant={currentPage === totalPages ? "contained" : "outlined"}
                onClick={() => setCurrentPage(totalPages)}
                sx={{ minWidth: '36px' }}
              >
                {totalPages}
              </Button>
            )}

            {/* Next button */}
            <Button
              size="small"
              variant="outlined"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </Stack>
        </Box>
      )}
      <Dialog open={showDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 22 }}>
          {selectedBook?.title}
        </DialogTitle>

        <DialogContent dividers>

          {/* Book Info Section */}
          <Box display="flex" gap={3} mb={3}>
  <Avatar
    variant="square"
    src={selectedBook?.CoverImage || '/defaultbookcover.png'}
    sx={{
      width: 130,
      height: 180,
      borderRadius: 2,
      boxShadow: 3,
      bgcolor: '#f0f0f0',
    }}
  />
  <Box display="flex" flexDirection="column" gap={1}>
    <Typography variant="subtitle1">
      <strong>Author:</strong> {selectedBook?.author || 'Unknown'}
    </Typography>

    {typeof selectedBook?.discountPercentage === 'number' && selectedBook.discountPercentage > 0 ? (
      <>
        <Typography variant="subtitle1">
          <strong>Original Price:</strong>{' '}
          <span style={{ textDecoration: 'line-through', color: '#999' }}>
            ${selectedBook?.price?.toFixed(2) || '0.00'}
          </span>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'green', fontWeight: 'bold' }}>
          <strong>Discounted Price:</strong> $
          {(selectedBook?.price * (1 - selectedBook.discountPercentage / 100)).toFixed(2)}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'green' }}>
          ({selectedBook.discountPercentage}% OFF)
        </Typography>
      </>
    ) : (
      <Typography variant="subtitle1">
        <strong>Price:</strong> ${selectedBook?.price?.toFixed(2) || '0.00'}
      </Typography>
    )}

    <Typography variant="subtitle1">
      <strong>Publisher:</strong> {selectedBook?.supplierName || 'Unknown'}
    </Typography>
    <Typography variant="subtitle1">
      <strong>Quantity:</strong> {selectedBook?.units ?? 'Unknown'}
    </Typography>
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
            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
            ) : (
              <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, px: 1 }}>
                {reviews.map((review, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">{review.reviewerName}</Typography>
                    <Rating value={review.rating || 0} readOnly size="small" sx={{ mb: 0.5 }} />
                    <Typography variant="body2" sx={{ mb: 0.5 }}>{review.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </Typography>
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
  selectedCategory: PropTypes.string,
};

// -----------------------------------------------------------------------------
// Main Marketplace Component
// (This wraps the DashboardLayout from Toolpad and holds the searchTerm state.)
// -----------------------------------------------------------------------------
function Marketplace(props) {
  const { window } = props;
  const router = useDemoRouter('/featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [prevPath, setPrevPath] = useState(router.pathname);

  const selectedCategory = router.pathname?.replace('/', '') === 'featured'
    ? null
    : NAVIGATION.find(nav => nav.segment === router.pathname?.replace('/', ''))?.title ?? null;

  const demoWindow = window !== undefined ? window() : undefined;

  // Reset search term when category changes
  useEffect(() => {
    if (router.pathname !== prevPath) {
      setSearchTerm('');
      setPrevPath(router.pathname);
    }
  }, [router.pathname, prevPath]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ title: 'Cougar Catalog', logo: <img src="/logo.png" alt="logo" /> }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => (
            <ToolbarActionsSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          ),
        }}
      >
        <PageContent searchTerm={searchTerm} selectedCategory={selectedCategory} />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Marketplace;