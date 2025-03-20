import React, { useState } from "react";
import PropTypes from 'prop-types';
import {Box, Button, Menu, MenuItem, Paper, Card, CardMedia, CardContent, InputAdornment} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { createTheme, keyframes } from '@mui/material/styles';
import { experimentalStyled as styled } from '@mui/material/styles';
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
import { useNavigate, useLocation, Link } from 'react-router-dom';

const products = [
  { id: 1, name: "The Great Gatsby", price: "$10.99", image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg" },
  { id: 2, name: "1984", price: "$8.99", image: "https://via.placeholder.com/300" },
  { id: 3, name: "To Kill a Mockingbird", price: "$12.99", image: "https://via.placeholder.com/300" },
  { id: 4, name: "Moby Dick", price: "$14.99", image: "https://via.placeholder.com/300" },
  { id: 5, name: "War and Peace", price: "$18.99", image: "https://via.placeholder.com/300" },
  { id: 6, name: "Pride and Prejudice", price: "$9.99", image: "https://via.placeholder.com/300" },
  { id: 7, name: "The Catcher in the Rye", price: "$11.99", image: "https://via.placeholder.com/300" },
  { id: 8, name: "The Hobbit", price: "$13.99", image: "https://via.placeholder.com/300" },
  { id: 9, name: "Brave New World", price: "$10.49", image: "https://via.placeholder.com/300" },
  { id: 10, name: "The Odyssey", price: "$15.99", image: "https://via.placeholder.com/300" },
  { id: 11, name: "Crime and Punishment", price: "$12.49", image: "https://via.placeholder.com/300" },
  { id: 12, name: "The Brothers Karamazov", price: "$16.99", image: "https://via.placeholder.com/300" },
  { id: 13, name: "Catch-22", price: "$13.49", image: "https://via.placeholder.com/300" },
  { id: 14, name: "Animal Farm", price: "$7.99", image: "https://via.placeholder.com/300" },
  { id: 15, name: "The Divine Comedy", price: "$19.99", image: "https://via.placeholder.com/300" },
];


const NAVIGATION = [
  {
    kind: 'header',
    title: 'Categories',
  },
  {
    segment: 'fiction',
    title: 'Fiction',
    icon: <MenuBookIcon />,
  },
  {
    segment: 'non-fiction',
    title: 'Non-fiction',
    icon: <SubjectIcon />,
  },
  {
    segment: 'mystery',
    title: 'Mystery',
    icon: <AutoStoriesIcon />,
  },
  {
    segment: 'romance',
    title: 'Romance',
    icon: <StarRateIcon />,
  },
  {
    segment: 'science-fiction',
    title: 'Science Fiction',
    icon: <ScienceIcon />,
  },
  {
    segment: 'fantasy',
    title: 'Fantasy',
    icon: <MoodIcon />,
  },
  {
    segment: 'biography',
    title: 'Biography',
    icon: <LocalLibraryIcon />,
  },
  {
    segment: 'history',
    title: 'History',
    icon: <HistoryEduIcon />,
  },
  {
    segment: 'self-help',
    title: 'Self-Help',
    icon: <PsychologyIcon />,
  },
  {
    segment: 'poetry',
    title: 'Poetry',
    icon: <SchoolIcon />,
  },
  {
    segment: 'thriller',
    title: 'Thriller',
    icon: <WhatshotIcon />,
  },
  {
    segment: 'young-adult',
    title: 'Young Adult',
    icon: <PsychologyAltIcon />,
  },
];

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

function ToolbarActionsSearch() {
  const navigate = useNavigate();
  //manage account menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  }

  return (
    <Stack direction="row" >
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>

      <TextField
        label="Search"
        variant="outlined"
        size="small"
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

      {/* Account Icon with Dropdown */}
      <Tooltip title="Account">
        <IconButton color="primary" onClick={handleAccountMenuClick} >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>

      {/* Account Dropdown Menu */}
      <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleAccountMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
        <MenuItem component={Link} to="/login">Login</MenuItem>
        <MenuItem component={Link} to="/signup">Signup</MenuItem>
      </Menu>

      {/* Shopping Cart Icon */}
      <Tooltip title="Shopping Cart">
        <IconButton color="primary" onClick={() => navigate("/cart")} >
          <ShoppingCartIcon />
        </IconButton>
      </Tooltip>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </Stack>
  );
}

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));

function PageContent({ pathname }) {
  return (
    <Box sx={{ flexGrow: 1, p: 4}}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>Featured</Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg:3 }} key={product.id}>
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
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "contain", height: 200, backgroundColor: "#f5f5f5" }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                <Typography variant="body1" color="primary">{product.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

PageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Marketplace(props) {
  const { window } = props;

  const router = useDemoRouter('/page');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{ 
        title: 'Cougar Catalog',
        logo: <img src="src/assets/logo.png" alt="png" />
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout slots={{
        toolbarActions: ToolbarActionsSearch,
      }}>
        <PageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}



export default Marketplace;