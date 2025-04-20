import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, MenuItem, Button, Divider, Stack, ToggleButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subMonths, subYears } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import reportApi from '../../../../api/reportApi';

const AuthorSalesReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportResult, setReportResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailedView, setDetailedView] = useState(false);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    // If we have report results and detailed view is enabled, fetch raw data
    if (reportResult.length > 0 && detailedView) {
      const fetchRawData = async () => {
        try {
          setLoading(true);
          const formattedStart = formatDateString(startDate);
          const formattedEnd = formatDateString(endDate);

          const rawDataResponse = await reportApi.generateReport('Sales by Author (RAW)', formattedStart, formattedEnd);
          setRawData(rawDataResponse.data || []);
        } catch (error) {
          console.error("Failed to fetch raw data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRawData();
    }
  }, [detailedView, reportResult, startDate, endDate]);

  const formatDateString = (date) =>
    date ? date.toISOString().split('T')[0] : null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      // Clear raw data when generating a new report
      setRawData([]);

      const formattedStart = formatDateString(startDate);
      const formattedEnd = formatDateString(endDate);

      console.log("Sending formatted dates:", {
        formattedStart,
        formattedEnd
      });

      const response = await reportApi.generateReport(
        'Sales by Author',
        formattedStart,
        formattedEnd
      );

      setReportResult(response.data || []);
    } catch (error) {
      console.error("Failed to generate author sales report:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRawDataTable = () => {
    if (!detailedView || rawData.length === 0) return null;

    const rawColumns = Object.keys(rawData[0] || {}).map(key => {
      // Check for specific fields that should be formatted as currency
      const isCurrencyField =
        key === 'Price' ||
        key === 'LineItemAmount' ||
        key.endsWith('Price') ||
        key.endsWith('Amount') ||
        key.includes('Total') && !key.includes('Quantity');

      // Define appropriate width based on column content type
      let width;
      if (key.includes('Id')) {
        width = 220;
      } else if (key.includes('Date')) {
        width = 120;
      } else if (key.includes('Title') || key.includes('Author')) {
        width = 180;
      } else {
        width = 150;
      }

      return {
        field: key,
        headerName: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        width: width,
        minWidth: 80,
        renderCell: (params) => {
          const value = params.value;

          // Format currency fields
          if (isCurrencyField) {
            if (value !== null && value !== undefined) {
              const numValue = typeof value === 'string' ? parseFloat(value) : value;
              if (!isNaN(numValue)) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(numValue);
              }
            }
          }

          // Format other number fields with thousand separators
          if (typeof value === 'number') {
            return new Intl.NumberFormat('en-US').format(value);
          }

          return value;
        }
      };
    });

    const rawRows = rawData.map((row, i) => ({ id: i, ...row }));

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#ccc' }}>
          Raw Data ({formatDate(startDate)} - {formatDate(endDate)})
        </Typography>
        <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rawRows}
              columns={rawColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
              disableColumnMenu={false}
              disableSelectionOnClick
              scrollbarSize={12}
              getRowHeight={() => 'auto'}
              sx={{
                color: '#fff',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#333',
                  color: '#fff',
                  fontWeight: 'bold'
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                  backgroundColor: '#2a2a2a'
                },
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                  backgroundColor: '#1e1e1e'
                },
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'normal',
                  overflow: 'auto',
                  padding: '8px',
                },
                '& .MuiDataGrid-main': {
                  overflow: 'auto',
                },
                border: '1px solid #444'
              }}
            />
          </Box>
        </Paper>
      </Box>
    );
  };

  const setRangeFromToday = (months) => {
    const now = new Date();
    if (months === 12) setStartDate(subYears(now, 1));
    else setStartDate(subMonths(now, months));
    setEndDate(now);
  };

  const formatDate = (date) =>
    date ? new Intl.DateTimeFormat('en-US').format(new Date(date)) : '';

  const columns = [
    { field: 'AuthorName', headerName: 'Author', flex: 1 },
    { field: 'NumberOfBooks', headerName: 'Number of Books', flex: 1 },
    { field: 'TotalBooksSold', headerName: 'Total Books Sold', flex: 1 },
    {
      field: 'TotalRevenue',
      headerName: 'Total Revenue',
      flex: 1,
      renderCell: (params) => {
        const value = params.row.TotalRevenue;
        return <span>${Number(value).toFixed(2)}</span>;
      }
    },
    {
      field: 'AverageRevenuePerBook',
      headerName: 'Avg Revenue/Book',
      flex: 1,
      renderCell: (params) => {
        const value = params.row.AverageRevenuePerBook;
        return <span>${Number(value).toFixed(2)}</span>;
      }
    },
    { field: 'AvgUnitsPerOrder', headerName: 'Avg Units per Order', flex: 1 },
    { field: 'TopSellingBook', headerName: 'Top Selling Book', flex: 1 },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4, overflowY: 'auto' }}>
        <Paper sx={{ p: 4, backgroundColor: '#2b2b2b', color: '#fff' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>Sales Report by Author</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#ccc', mr: 1 }}>Detailed View:</Typography>
            <ToggleButton
              value="detailed"
              selected={detailedView}
              onChange={() => setDetailedView(!detailedView)}
              size="small"
            >
              {detailedView ? 'On' : 'Off'}
            </ToggleButton>
          </Box>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth sx={{ backgroundColor: '#1f1f1f' }}
                      InputLabelProps={{ style: { color: '#ccc' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  )}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth sx={{ backgroundColor: '#1f1f1f' }}
                      InputLabelProps={{ style: { color: '#ccc' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  )}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setRangeFromToday(1)}>Last 1M</Button>
                <Button variant="outlined" onClick={() => setRangeFromToday(6)}>Last 6M</Button>
                <Button variant="outlined" onClick={() => setRangeFromToday(12)}>Last 1Y</Button>
                <Button variant="contained" color="primary" onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Loading...' : 'Generate Report'}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#444' }} />

          <Typography variant="h6" gutterBottom>
            Author Sales Data ({formatDate(startDate)} - {formatDate(endDate)})
          </Typography>
          <Box sx={{ height: 500, backgroundColor: '#1a1a1a', p: 2 }}>
            <DataGrid
              rows={reportResult.map((r, i) => ({ id: i, ...r }))}
              columns={columns}
              sx={{ color: '#fff' }}
            />
          </Box>
          {renderRawDataTable()}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default AuthorSalesReport;