import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Grid, 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Badge
} from '@mui/material';
import { 
  ArrowBack, 
  CloudDownload, 
  Print, 
  FilterList, 
  ShoppingCart,
  AccountCircle,
  PictureAsPdf,
  Description,
  TableChart
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a dark theme
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#1E1E1E',
        paper: '#252525',
      },
      primary: {
        main: '#6366F1', // Purple accent color
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
      }
    },
  });


function ReportsPage() {
  // State for reports data
  const [reports, setReports] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [reportFormat, setReportFormat] = useState('PDF');
  const [startDate, setStartDate] = useState('2025-03-01');
  const [endDate, setEndDate] = useState('2025-03-22');
  const [description, setDescription] = useState('');
  
  // Sample reports data - in a real app, this would come from an API call
  useEffect(() => {
    // Simulate fetching data from backend
    const sampleReports = [
      { 
        id: '550e8400-e29b-41d4-a716-446655440000', 
        Report_Format: 'PDF', 
        Report_Descripti: 'Monthly Sales Summary', 
        Report_Documen: 'blob_data', 
        Employee_Id: 'e29b41d4-a716-4466-5544-000055e29b41',
        createdAt: '2025-03-19' 
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440001', 
        Report_Format: 'CSV', 
        Report_Descripti: 'Inventory Status Report', 
        Report_Documen: 'blob_data', 
        Employee_Id: 'e29b41d4-a716-4466-5544-000055e29b41',
        createdAt: '2025-03-18' 
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440002', 
        Report_Format: 'DOCX', 
        Report_Descripti: 'Customer Analysis Q1', 
        Report_Documen: 'blob_data', 
        Employee_Id: '71d4a716-4466-5544-0000-55e29b41d4a7',
        createdAt: '2025-03-17' 
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440003', 
        Report_Format: 'PDF', 
        Report_Descripti: 'Employee Performance Review', 
        Report_Documen: 'blob_data', 
        Employee_Id: '71d4a716-4466-5544-0000-55e29b41d4a7',
        createdAt: '2025-03-16' 
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440004', 
        Report_Format: 'CSV', 
        Report_Descripti: 'Daily Transactions Log', 
        Report_Documen: 'blob_data', 
        Employee_Id: 'e29b41d4-a716-4466-5544-000055e29b41',
        createdAt: '2025-03-15' 
      },
    ];
    
    setReports(sampleReports);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormatChange = (event) => {
    setReportFormat(event.target.value);
  };

  const handleGenerateReport = () => {
    // Generate a new report
    const newReport = {
      id: `new-${Date.now()}`,
      Report_Format: reportFormat,
      Report_Descripti: description,
      Report_Documen: 'new_blob_data',
      Employee_Id: 'e29b41d4-a716-4466-5544-000055e29b41', // Current user ID
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setReports([newReport, ...reports]);
    setDescription('');
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'PDF':
        return <PictureAsPdf sx={{ color: '#f44336' }}/>;
      case 'DOCX':
        return <Description sx={{ color: '#2196f3' }}/>;
      case 'CSV':
        return <TableChart sx={{ color: '#4caf50' }}/>;
      default:
        return <Description />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          bgcolor: '#252525',
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Reports
        </Typography>
        
        {/* Shopping cart and account icons */}
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Badge badgeContent={3} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Paper>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 4, flexGrow: 1, overflow: 'auto' }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#2A2A2A' }}>
                <Box
                  component="img"
                  src="https://shorturl.at/woo7A"
                  alt="Store Logo"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    mb: 1
                  }}
                />
                <Typography variant="h6">POS System</Typography>
                <Typography variant="body2" color="text.secondary">Store Admin</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Quick Reports
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start', mb: 1 }}
                >
                  Sales Summary
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start', mb: 1 }}
                >
                  Inventory Status
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start', mb: 1 }}
                >
                  Customer Analysis
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start', mb: 1 }}
                >
                  Employee Performance
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Reports Management
              </Typography>

              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="All Reports" />
                <Tab label="Generate New" />
                <Tab label="My Reports" />
                <Tab label="Archived" />
              </Tabs>
              
              {tabValue === 0 && (
                <>
                  {/* Filter Controls */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                    
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Format</InputLabel>
                      <Select
                        value={reportFormat}
                        onChange={handleFormatChange}
                        label="Format"
                      >
                        <MenuItem value="PDF">PDF</MenuItem>
                        <MenuItem value="DOCX">DOCX</MenuItem>
                        <MenuItem value="CSV">CSV</MenuItem>
                      </Select>
                    </FormControl>

                    <Box sx={{ flexGrow: 1 }} />
                    
                    <Button variant="outlined" startIcon={<FilterList />}>
                      Filter
                    </Button>
                    <Button variant="outlined" startIcon={<Print />}>
                      Print
                    </Button>
                    <Button variant="contained" startIcon={<CloudDownload />}>
                      Export
                    </Button>
                  </Box>

                  {/* Reports Table */}
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Format</TableCell>
                          <TableCell>Employee ID</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>{report.createdAt}</TableCell>
                            <TableCell>{report.Report_Descripti}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getFormatIcon(report.Report_Format)}
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  {report.Report_Format}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{report.Employee_Id.substring(0, 8)}...</TableCell>
                            <TableCell align="right">
                              <IconButton size="small" color="primary">
                                <CloudDownload />
                              </IconButton>
                              <IconButton size="small" color="default">
                                <Print />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {tabValue === 1 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>Generate New Report</Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Report Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Report Format</InputLabel>
                        <Select
                          value={reportFormat}
                          onChange={handleFormatChange}
                          label="Report Format"
                        >
                          <MenuItem value="PDF">PDF</MenuItem>
                          <MenuItem value="DOCX">DOCX</MenuItem>
                          <MenuItem value="CSV">CSV</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date Range"
                        type="text"
                        value={`${startDate} to ${endDate}`}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={handleGenerateReport}
                        >
                          Generate Report
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Save button at the bottom */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </ThemeProvider>
  );
}

export default ReportsPage;