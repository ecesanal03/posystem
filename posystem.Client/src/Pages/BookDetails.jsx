import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Tab,
  Tabs,
  TextField,
  Typography,
  Checkbox,
  Pagination,
  Select,
  InputLabel,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const BookImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '2rem',
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#f57c00',
  color: 'white',
  '&:hover': {
    backgroundColor: '#ef6c00',
  },
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  width: '100%',
}));

const WishListButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
  width: '100%',
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
}));

const StarsWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 8,
});

const CustomRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#f57c00',
  },
});

const ReviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: '1px solid #e0e0e0',
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`book-tabpanel-${index}`}
      aria-labelledby={`book-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Mock data for the book
const bookData = {
  title: "Night",
  authors: ["Elie Wiesel", "Marion Wiesel"],
  coverImage: "https://example.com/night-cover.jpg", // Replace with actual URL or placeholder
  rating: 4.5,
  reviewCount: 1203,
  price: 5.59,
  originalPrice: 21.00,
  savings: 15.41,
  inStock: 3,
  isbn: "0374399972",
  isbn13: "9780374399979",
  overview: "A New Translation From The French By Marion Wiesel Night is Elie Wiesel's masterpiece, a candid, horrific, and deeply poignant autobiographical account of his survival as a teenager in the Nazi death camps. This new translation by Marion Wiesel, Elie's wife and frequent translator, presents this seminal memoir in the language and spirit truest to the author's original intent. And in a substantive new preface, Elie reflects on the enduring importance of Night and his lifelong, passionate dedication to ensuring that the world never forgets man's capacity for inhumanity to man.",
  editionDetails: {
    format: "Hardcover",
    language: "English",
    isbn: "0374399972",
    isbn13: "9780374399979",
    releaseDate: "January 2006",
    publisher: "Hill & Wang",
    length: "144 Pages",
    weight: "0.54 lbs.",
    dimensions: "0.5\" x 5.7\" x 8.3\"",
  },
  aboutAuthor: "Elie Wiesel (1928-2016) was a Romanian-born American writer, professor, political activist, Nobel laureate, and Holocaust survivor. He authored 57 books, including Night, a work based on his experiences as a Jewish prisoner in the Auschwitz and Buchenwald concentration camps. Wiesel was awarded the Nobel Peace Prize in 1986.",
};

// Mock data for reviews
const mockReviews = [
  {
    id: 1, 
    user: "John D.",
    title: "Powerful and moving",
    rating: 5,
    date: "March 15, 2024",
    content: "This book changed my perspective on life. Wiesel's account is both devastating and necessary for understanding the depths of human suffering and resilience.",
    verifiedPurchase: true,
  },
  {
    id: 2,
    user: "Sarah M.",
    title: "Essential reading",
    rating: 5,
    date: "February 28, 2024",
    content: "Everyone should read this book at least once. The new translation captures the author's voice beautifully.",
    verifiedPurchase: true,
  },
  {
    id: 3,
    user: "Robert T.",
    title: "Profound impact",
    rating: 4,
    date: "January 10, 2024",
    content: "A difficult but necessary read. The prose is sparse yet powerful.",
    verifiedPurchase: false,
  },
  {
    id: 4,
    user: "Emily L.",
    title: "Haunting memoir",
    rating: 5,
    date: "December 12, 2023",
    content: "Wiesel's account will stay with you long after you finish reading. The writing is both beautiful and devastating.",
    verifiedPurchase: true,
  },
  {
    id: 5,
    user: "Michael P.",
    title: "Important historical document",
    rating: 4,
    date: "November 5, 2023",
    content: "Beyond its literary merit, this book serves as a crucial historical document and testimony.",
    verifiedPurchase: false,
  },
  {
    id: 6,
    user: "Lisa K.",
    title: "Required reading",
    rating: 5,
    date: "October 20, 2023",
    content: "I read this with my high school students every year, and it never fails to create meaningful discussions.",
    verifiedPurchase: true,
  },
  {
    id: 7,
    user: "David W.",
    title: "Difficult but necessary",
    rating: 4,
    date: "September 8, 2023",
    content: "Not an easy read, but a necessary one for understanding our history.",
    verifiedPurchase: true,
  },
  {
    id: 8,
    user: "Jessica B.",
    title: "Deeply moving",
    rating: 5,
    date: "August 15, 2023",
    content: "I couldn't put it down. Wiesel's ability to convey such profound truths in simple language is remarkable.",
    verifiedPurchase: true,
  },
  {
    id: 9,
    user: "Thomas H.",
    title: "Poignant and powerful",
    rating: 5,
    date: "July 22, 2023",
    content: "This slim volume contains more truth than books many times its length.",
    verifiedPurchase: false,
  },
  {
    id: 10,
    user: "Rebecca M.",
    title: "Devastating read",
    rating: 4,
    date: "June 17, 2023",
    content: "Haunting and powerful. The new translation brings fresh clarity to Wiesel's voice.",
    verifiedPurchase: true,
  },
  {
    id: 11,
    user: "James C.",
    title: "Essential testimony",
    rating: 5,
    date: "May 10, 2023",
    content: "One of the most important books of the 20th century. Should be required reading for all.",
    verifiedPurchase: true,
  },
  {
    id: 12,
    user: "Katherine S.",
    title: "Never forget",
    rating: 5,
    date: "April 5, 2023",
    content: "Wiesel's testimony ensures that we never forget the horrors of the Holocaust.",
    verifiedPurchase: true,
  },
];

const BookDetailsPage = () => {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [starFilter, setStarFilter] = useState(0); // 0 means no filter
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    rating: 0,
  });

  // Reviews per page
  const reviewsPerPage = 10;

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle review pagination
  const handleReviewPageChange = (event, value) => {
    setReviewPage(value);
  };

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Apply filters to reviews
  const filteredReviews = mockReviews.filter(review => {
    if (starFilter > 0 && review.rating !== starFilter) {
      return false;
    }
    if (verifiedOnly && !review.verifiedPurchase) {
      return false;
    }
    return true;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Get current page reviews
  const currentReviews = filteredReviews.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage
  );

  // Handle review dialog
  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
    // Reset new review form
    setNewReview({
      title: '',
      content: '',
      rating: 0,
    });
  };

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setNewReview(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmitReview = () => {
    // Here you would typically send the review to your backend
    console.log('Submitting review:', newReview);
    // Close the dialog
    handleReviewDialogClose();
    // In a real app, you would add the new review to your reviews list
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header/Nav would go here */}
      <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            BookStore
          </Typography>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {/* Book Details Section */}
        <Grid container spacing={4}>
          {/* Left Column - Book Image */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BookImage
                src="/api/placeholder/300/450"
                alt={bookData.title}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Book Info */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              {bookData.title}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              By {bookData.authors.join(' and ')}
            </Typography>
            
            <StarsWrapper>
              <CustomRating 
                value={bookData.rating} 
                precision={0.5} 
                readOnly 
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({bookData.reviewCount} reviews)
              </Typography>
            </StarsWrapper>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PriceTypography>
                ${bookData.price.toFixed(2)}
              </PriceTypography>
              <OriginalPrice variant="body1">
                ${bookData.originalPrice.toFixed(2)}
              </OriginalPrice>
            </Box>
            
            <Typography variant="body1" gutterBottom>
              Save ${bookData.savings.toFixed(2)}! (
              {Math.round((bookData.savings / bookData.originalPrice) * 100)}% off)
            </Typography>
            
            {bookData.inStock <= 5 && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                Almost Gone, Only {bookData.inStock} Left!
              </Typography>
            )}
            
            <Box sx={{ mt: 3, mb: 4 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography>Quantity:</Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <Select
                      defaultValue={1}
                      size="small"
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            
            <AddToCartButton 
              variant="contained" 
              startIcon={<ShoppingCartIcon />}
            >
              Add to Cart
            </AddToCartButton>
            
            <WishListButton 
              variant="outlined" 
              startIcon={<FavoriteIcon />}
            >
              Add to Wish List
            </WishListButton>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper sx={{ width: '100%', mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Book Overview" />
            <Tab label="Edition Details" />
            <Tab label="About the Author" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" paragraph>
              {bookData.overview}
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">Format:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.format}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">Language:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.language}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">ISBN:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.isbn}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">ISBN13:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.isbn13}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">Release Date:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.releaseDate}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">Publisher:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.publisher}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">Length:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.length}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">Weight:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.weight}</Typography>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Typography variant="body1" fontWeight="bold">Dimensions:</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography variant="body1">{bookData.editionDetails.dimensions}</Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1" paragraph>
              {bookData.aboutAuthor}
            </Typography>
          </TabPanel>
        </Paper>

        {/* Reviews Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Customer Reviews
          </Typography>

          <FilterPaper>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReviewDialogOpen}
                sx={{ mr: 2 }}
              >
                Write a Review
              </Button>

              <Button
                startIcon={<FilterListIcon />}
                variant="outlined"
                onClick={handleFilterClick}
              >
                Filter Reviews
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
              >
                <MenuItem onClick={() => setStarFilter(0)}>All Stars</MenuItem>
                <MenuItem onClick={() => setStarFilter(5)}>5 Stars Only</MenuItem>
                <MenuItem onClick={() => setStarFilter(4)}>4 Stars Only</MenuItem>
                <MenuItem onClick={() => setStarFilter(3)}>3 Stars Only</MenuItem>
                <MenuItem onClick={() => setStarFilter(2)}>2 Stars Only</MenuItem>
                <MenuItem onClick={() => setStarFilter(1)}>1 Star Only</MenuItem>
                <Divider />
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                      />
                    }
                    label="Verified Purchases Only"
                  />
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {starFilter > 0 && (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Filtered by {starFilter} star{starFilter !== 1 ? 's' : ''}
                  </Typography>
                  <IconButton size="small" onClick={() => setStarFilter(0)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              {verifiedOnly && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Verified purchases only
                  </Typography>
                  <IconButton size="small" onClick={() => setVerifiedOnly(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </FilterPaper>

          {/* Review List */}
          {currentReviews.length > 0 ? (
            <Box>
              {currentReviews.map((review) => (
                <ReviewCard key={review.id}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6">{review.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CustomRating value={review.rating} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                by {review.user} on {review.date}
                              </Typography>
                            </Box>
                            {review.verifiedPurchase && (
                              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Verified Purchase
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body1">{review.content}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </ReviewCard>
              ))}

              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                <Pagination
                  count={totalPages}
                  page={reviewPage}
                  onChange={handleReviewPageChange}
                  color="primary"
                />
              </Box>
            </Box>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No reviews match your filters</Typography>
              <Button color="primary" onClick={() => {
                setStarFilter(0);
                setVerifiedOnly(false);
              }}>
                Clear Filters
              </Button>
            </Paper>
          )}
        </Box>

        {/* Review Dialog */}
        <Dialog 
          open={reviewDialogOpen} 
          onClose={handleReviewDialogClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Write a Review
              <IconButton onClick={handleReviewDialogClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3, mt: 1 }}>
              <Typography variant="h6" gutterBottom>
                {bookData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By {bookData.authors.join(' and ')}
              </Typography>
            </Box>

            <TextField
              label="Review Title"
              name="title"
              value={newReview.title}
              onChange={handleReviewChange}
              fullWidth
              required
              margin="normal"
            />

            <Box sx={{ my: 2 }}>
              <Typography component="legend">Your Rating *</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomRating
                  name="rating"
                  value={newReview.rating}
                  onChange={handleRatingChange}
                  size="large"
                  required
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {newReview.rating > 0 ? `${newReview.rating} stars` : 'Select a rating'}
                </Typography>
              </Box>
            </Box>

            <TextField
              label="Write Your Review"
              name="content"
              value={newReview.content}
              onChange={handleReviewChange}
              multiline
              rows={6}
              fullWidth
              required
              margin="normal"
              placeholder="What did you like or dislike? What did you use this product for?"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReviewDialogClose}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubmitReview}
              disabled={!newReview.title || !newReview.content || newReview.rating === 0}
            >
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BookDetailsPage;