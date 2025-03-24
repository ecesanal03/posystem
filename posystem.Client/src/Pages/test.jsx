import { Box, AppBar, Toolbar, Drawer, Typography, CssBaseline } from '@mui/material';

const drawerWidth = 240;
const BGcolor = '#18230F';

function SimplePage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'primary.main', // Blue header
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Header
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: BGcolor,
            padding: 0,
          },
        }}
      >
        <Box sx={{
            width: '100%',
            bgcolor: '#1F7D53',
        }}>
            <Typography 
                variant="h6"
                color='white'
                padding={2}
                sx={{
                    width: '100%',
                    bgcolor: BGcolor,
                    padding: 2,
                }}>
                Logo
            </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color='white'>Sidebar</Typography>
        </Box>
      </Drawer>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'success.light', // Green body
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* This creates space for the header */}
        <Typography variant="h5">Main Content Area</Typography>
      </Box>
    </Box>
  );
}

export default SimplePage;
