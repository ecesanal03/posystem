import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Divider, Stack, Tabs, Tab, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subMonths, subYears } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, LabelList
} from 'recharts';
import reportApi from '../../../../api/reportApi';

const CustomerSubscriptionReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportResult, setReportResult] = useState([]);
  const [summaryResult, setSummaryResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [detailedView, setDetailedView] = useState(false);
  const [rawData, setRawData] = useState([]);

  const formatDateString = (date) => date ? date.toISOString().split('T')[0] : null;

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  useEffect(() => {
    // If we have report results and detailed view is enabled, fetch raw data
    if (reportResult.length > 0 && detailedView) {
      const fetchRawData = async () => {
        try {
          setLoading(true);
          let reportName;
          if (tab === 0) reportName = 'Customer Subscription Over Time';
          else if (tab === 1) reportName = 'Customer Subscription by Location';
          else if (tab === 2) reportName = 'Subscription to Purchase Conversion Report';

          const rawDataResponse = await reportApi.generateReport(`${reportName} (RAW)`, formatDateString(startDate), formatDateString(endDate));
          setRawData(rawDataResponse.data || []);
        } catch (error) {
          console.error("Failed to fetch raw data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRawData();
    }
  }, [detailedView, reportResult, tab, startDate, endDate, rawData.length]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      // Clear raw data when generating a new report
      setRawData([]);

      const formattedStart = formatDateString(startDate);
      const formattedEnd = formatDateString(endDate);

      let reportName;
      if (tab === 0) reportName = 'Customer Subscription Over Time';
      else if (tab === 1) reportName = 'Customer Subscription by Location';
      else if (tab === 2) reportName = 'Subscription to Purchase Conversion Report';

      const response = await reportApi.generateReport(reportName, formattedStart, formattedEnd);
      setReportResult(response.data || []);

      if (tab === 2) {
        const summaryResponse = await reportApi.generateReport('Customer Purchase Summary', formattedStart, formattedEnd);
        setSummaryResult(summaryResponse.data || []);
      } else {
        setSummaryResult([]);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
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

  const renderRawDataTable = () => {
    if (!detailedView || rawData.length === 0) return null;

    const rawColumns = Object.keys(rawData[0] || {}).map(key => {
      // Check for specific fields that should be formatted as currency
      const isCurrencyField =
        key === 'Price' ||
        key === 'ConversionRate' ||
        key === 'SubscriptionRate' ||
        key.endsWith('Price') ||
        key.endsWith('Amount') ||
        key.includes('Total') && !key.includes('Quantity');

      // Define appropriate width based on column content type
      let width;
      if (key.includes('Id')) {
        width = 220;
      } else if (key.includes('Date')) {
        width = 120;
      } else if (key.includes('Name')) {
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
          Raw Data ({formatDisplayDate(startDate)} - {formatDisplayDate(endDate)})
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

  const columnsTime = [
    {
      field: 'SignupDate',
      headerName: 'Signup Date',
      flex: 1,
      renderCell: (params) => {
        const raw = params.row.SignupDate;
        const date = new Date(raw);
        const formatted = isNaN(date)
          ? raw
          : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }).format(date);
        return <span>{formatted}</span>;
      }
    },
    { field: 'TotalSignups', headerName: 'Total Signups', flex: 1 },
  ];

  const columnsLocation = [
    { field: 'Country', headerName: 'Country', flex: 1 },
    { field: 'City', headerName: 'City', flex: 1 },
    { field: 'TotalSignups', headerName: 'Total Signups', flex: 1 }
  ];

  const columnsConversion = [
    {
      field: 'SignupDate',
      headerName: 'Signup Date',
      flex: 1,
      renderCell: (params) => {
        const raw = params.row.SignupDate;
        const date = new Date(raw);
        return isNaN(date)
          ? raw
          : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }).format(date);
      }
    },
    {
      field: 'TotalSignups',
      headerName: 'Total Signups',
      flex: 1,
      renderCell: (params) => <span>{params.row.TotalSignups ?? 0}</span>
    },
    {
      field: 'TotalPurchasesAfterSignup',
      headerName: 'Purchases After Signup',
      flex: 1,
      renderCell: (params) => <span>{params.row.TotalPurchasesAfterSignup ?? 0}</span>
    },
    {
      field: 'ConversionRate',
      headerName: 'Conversion Rate (%)',
      flex: 1,
      renderCell: (params) => {
        const rate = parseFloat(params.row.ConversionRate ?? 0);
        return <span>{isNaN(rate) ? '0%' : `${rate.toFixed(2)}%`}</span>;
      }
    }
  ];


  const sortedLocationData = [...reportResult].sort((a, b) => b.TotalSignups - a.TotalSignups).slice(0, 5);
  const totalSignups = reportResult.reduce((sum, row) => sum + (row.TotalSignups || 0), 0);
  const totalAccounts = summaryResult[0]?.TotalAccounts || 0;
  const customersWhoPurchased = summaryResult[0]?.CustomersWhoPurchased || 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4, overflowY: 'auto' }}>
        <Paper sx={{ p: 4, backgroundColor: '#2b2b2b', color: '#fff' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Customer Subscription Report</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Tabs
              value={tab}
              onChange={(e, newVal) => {
                setTab(newVal);
                setReportResult([]);
                setSummaryResult([]);
                setRawData([]);
              }}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Signup Over Time" />
              <Tab label="Signup by Location" />
              <Tab label="Conversion After Signup" />
            </Tabs>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          </Box>

          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2}>
                <DatePicker label="Start Date" value={startDate} onChange={(val) => setStartDate(val)} renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ backgroundColor: '#1f1f1f' }} InputLabelProps={{ style: { color: '#ccc' } }} InputProps={{ style: { color: '#fff' } }} />
                )} />
                <DatePicker label="End Date" value={endDate} onChange={(val) => setEndDate(val)} renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ backgroundColor: '#1f1f1f' }} InputLabelProps={{ style: { color: '#ccc' } }} InputProps={{ style: { color: '#fff' } }} />
                )} />
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

          {tab === 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Signup Over Time ({formatDisplayDate(startDate)} - {formatDisplayDate(endDate)})</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>📈 Total Signups: {totalSignups}</Typography>
              <Box sx={{ height: 400, backgroundColor: '#1a1a1a', p: 2 }}>
                <DataGrid rows={reportResult.map((r, i) => ({ id: i, ...r }))} columns={columnsTime} sx={{ color: '#fff' }} />
              </Box>
              <Box sx={{ height: 400, backgroundColor: '#1a1a1a', p: 2, mb: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reportResult}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="SignupDate"
                      tickFormatter={(tick) =>
                        new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          year: 'numeric',
                        }).format(new Date(tick))
                      }
                      stroke="#ccc"
                      interval={Math.ceil(reportResult.length / 12)} // dynamically space out based on data
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />

                    <YAxis
                      stroke="#ccc"
                      label={{
                        value: 'Signups',
                        angle: -90,
                        position: 'insideLeft',
                        offset: 10,
                        fill: '#ccc'
                      }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }}
                      labelFormatter={(label) =>
                        new Intl.DateTimeFormat('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }).format(new Date(label))
                      }
                      formatter={(value) => [`${value}`, 'Signups']}
                    />
                    <Line
                      type="monotone"
                      dataKey="TotalSignups"
                      stroke="#8499D9"
                      strokeWidth={2}
                      activeDot={{ r: 5 }}
                      dot={(props) => {
                        const { index, payload, points } = props;
                        const prev = reportResult[index - 1]?.TotalSignups ?? null;
                        const next = reportResult[index + 1]?.TotalSignups ?? null;
                        const current = payload.TotalSignups;

                        const isPeak = (prev !== null && next !== null && current > prev && current > next);

                        return isPeak ? (
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={4}
                            fill="#fff"
                            stroke="#8499D9"
                            strokeWidth={1}
                          />
                        ) : null;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              {renderRawDataTable()}
            </>
          )}

          {tab === 1 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Signup by Location ({formatDisplayDate(startDate)} - {formatDisplayDate(endDate)})</Typography>
              <Box sx={{ height: 400, backgroundColor: '#1a1a1a', p: 2 }}>
                <DataGrid rows={reportResult.map((r, i) => ({ id: i, ...r }))} columns={columnsLocation} sx={{ color: '#fff' }} />
              </Box>
              <Box sx={{ height: 400, backgroundColor: '#1a1a1a', p: 2, mb: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedLocationData} layout="vertical" margin={{ left: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" stroke="#ccc" />
                    <YAxis type="category" dataKey={(row) => `${row.City}, ${row.Country}`} stroke="#ccc" width={150} />
                    <Tooltip />
                    <Bar dataKey="TotalSignups" fill="#8499D9">
                      <LabelList dataKey="TotalSignups" position="right" fill="#fff" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {renderRawDataTable()}
            </>
          )}

          {tab === 2 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Conversion After Signup ({formatDisplayDate(startDate)} - {formatDisplayDate(endDate)})</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>👥 Total Accounts: {totalAccounts} | 🛒 Customers Who Purchased: {customersWhoPurchased}</Typography>
              <Box sx={{ height: 500, backgroundColor: '#1a1a1a', p: 2 }}>
                <DataGrid rows={reportResult.map((r, i) => ({ id: i, ...r }))} columns={columnsConversion} sx={{ color: '#fff' }} />
              </Box>
              <Box sx={{ height: 400, backgroundColor: '#1a1a1a', p: 2, mb: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportResult}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="SignupDate"
                      tickFormatter={formatDisplayDate}
                      stroke="#ccc"
                      angle={-45}
                      textAnchor="end"
                      interval={Math.ceil(reportResult.length / 15)}
                      height={80}
                    />
                    <YAxis
                      stroke="#ccc"
                      tickFormatter={(v) => `${v}%`}
                      label={{
                        value: "Conversion Rate",
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#ccc'
                      }}
                    />
                    <Tooltip
                      formatter={(value) => `${value}%`}
                      labelFormatter={formatDisplayDate}
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="ConversionRate" fill="#21AFBF" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {renderRawDataTable()}
            </>
          )}

        </Paper>
      </Box>
    </LocalizationProvider>
  );
};



export default CustomerSubscriptionReport;