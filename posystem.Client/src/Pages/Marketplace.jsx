import React, { useState } from "react";
import PropTypes from 'prop-types';
import {Box, Button, Menu, MenuItem} from '@mui/material';
import Typography from '@mui/material/Typography';
import { createTheme, keyframes } from '@mui/material/styles';
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PianoOutlinedIcon from '@mui/icons-material/PianoOutlined';
import CableIcon from '@mui/icons-material/Cable';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import SportsFootballOutlinedIcon from '@mui/icons-material/SportsFootballOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined';
import ToysOutlinedIcon from '@mui/icons-material/ToysOutlined';
import AddIcon from '@mui/icons-material/Add';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { Link } from "react-router-dom";

const NAVIGATION = [
  {
    kind: 'header',
    title: 'New Listing',
  },
  {
    kind: 'action',
    title: 'Create A Listing',
    icon: <AddIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Categories',
  },
  {
    segment: 'electronics',
    title: 'Electronics',
    icon: <CableIcon />,
  },
  {
    segment: 'clothing',
    title: 'Clothing',
    icon: <CheckroomIcon />,
  },
  {
    segment: 'collectibles',
    title: 'Collectibles',
    icon: <HourglassBottomIcon />,
  },
  {
    segment: 'jewelry',
    title: 'Jewelry',
    icon: <DiamondOutlinedIcon />,
  },
  {
    segment: 'sporting-goods',
    title: 'Sporting Goods',
    icon: <SportsFootballOutlinedIcon />,
  },
  {
    segment: 'instruments',
    title: 'Instruments',
    icon: <PianoOutlinedIcon />,
  },
  {
    segment: 'motor',
    title: 'Motor Vehicles',
    icon: <DirectionsCarFilledOutlinedIcon />,
  },
  {
    segment: 'gardening',
    title: 'Gardening',
    icon: <LocalFloristOutlinedIcon />,
  },
  {
    segment: 'home',
    title: 'Home & Furniture',
    icon: <HomeOutlinedIcon />,
  },
  {
    segment: 'books',
    title: 'Books & Media',
    icon: <BookOutlinedIcon />,
  },
  {
    segment: 'pet',
    title: 'Pet Supplies',
    icon: <PetsOutlinedIcon />,
  },
  {
    segment: 'arts',
    title: 'Arts & Crafts',
    icon: <DrawOutlinedIcon />,
  },
  {
    segment: 'beauty',
    title: 'Beauty & Health',
    icon: <FaceRetouchingNaturalOutlinedIcon />,
  },
  {
    segment: 'toys',
    title: 'Toys & Games',
    icon: <ToysOutlinedIcon />,
  },
  {
    segment: 'music',
    title: 'Music',
    icon: <QueueMusicOutlinedIcon />,
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
    <Stack direction="row" spacing={1} alignItems="center">
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
        sx={{ display: { xs: "none", md: "inline-block" }, mr: 1 }}
      />

      {/* Account Icon with Dropdown */}
      <Tooltip title="Account">
        <IconButton color="primary" onClick={handleAccountMenuClick}>
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
        <IconButton color="primary">
          <ShoppingCartIcon />
        </IconButton>
      </Tooltip>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </Stack>
  );
}

function PageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
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
        title: 'Marketplace',
        logo: <img src="https://shorturl.at/woo7A" alt="jpeg" />
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