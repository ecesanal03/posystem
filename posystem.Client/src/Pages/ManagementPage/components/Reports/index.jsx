import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper,
  Tabs,
  Tab
} from '@mui/material';

// Import individual report components
import SalesReports from './R1';
import Report2 from './R2';
import Report3 from './R3';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
      style={{ height: '100%', overflow: 'auto' }}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden'
    }}>
      <Paper sx={{ 
        width: '100%', 
        bgcolor: '#25292A', 
        borderRadius: 0, 
        boxShadow: 'none',
        borderBottom: '1px solid #61677A'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#536DFE'
            }
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#fff',
                fontWeight: 'bold'
              }
            }
          }}
        >
          <Tab label="Report 1" />
          <Tab label="Report 2" />
          <Tab label="Report 3" />
        </Tabs>
      </Paper>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <TabPanel value={activeTab} index={0}>
          {/* Ece you should be able to see the report 1 here */}
          <SalesReports />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Report2 />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Report3 />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default ReportsPage;
