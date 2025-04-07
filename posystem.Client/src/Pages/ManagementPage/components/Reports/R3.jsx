import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, MenuItem, Button, Divider, Stack
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

  const formatDateString = (date) =>
  date ? date.toISOString().split('T')[0] : null;

  const handleGenerate = async () => {
    try {
      setLoading(true);

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
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default AuthorSalesReport;

