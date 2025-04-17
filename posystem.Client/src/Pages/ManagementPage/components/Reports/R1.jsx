import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, MenuItem, Button, Divider, Stack, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subMonths, subYears } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, LineChart, Line } from 'recharts';
import reportApi from '../../../../api/reportApi';

const filterOptions = [
  { label: 'Overall Sales', value: 'overall' },
  { label: 'By Customer', value: 'customer' },
  { label: 'By Book', value: 'book' },
  { label: 'By Supplier', value: 'supplier' }
];

const topOptions = [10, 25, 50, 100, 'All'];
const pieColors = ['#8499D9', '#21AFBF', '#F25E5E', '#8C5E26', '#A569BD', '#F4D03F', '#58D68D', '#5DADE2'];

const SalesReports = () => {
  const [filterType, setFilterType] = useState('overall');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportResult, setReportResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('summary');
  const [topCount, setTopCount] = useState(10);
  const [detailedView, setDetailedView] = useState(false);
  const [rawData, setRawData] = useState([]);

  // ADD THIS USEEFFECT HOOK
  useEffect(() => {
    // If we have report results and detailed view is enabled, fetch raw data
    if (reportResult.length > 0 && detailedView && rawData.length === 0) {
      const fetchRawData = async () => {
        try {
          setLoading(true);
          let reportName = 'Sales Summary Report';
          if (filterType === 'customer') reportName = 'Sales by Customer';
          else if (filterType === 'book') reportName = 'Sales by Book';
          else if (filterType === 'supplier') reportName = 'Sales by Supplier';
          else if (filterType === 'overall' && viewMode === 'graph') reportName = 'Sales Summary Over Time';

          const rawDataResponse = await reportApi.generateReport(`${reportName} (RAW)`, startDate, endDate);
          setRawData(rawDataResponse.data || []);
        } catch (error) {
          console.error("Failed to fetch raw data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRawData();
    }
  }, [detailedView, reportResult, filterType, viewMode, startDate, endDate, rawData.length]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      let reportName = 'Sales Summary Report';
      if (filterType === 'customer') reportName = 'Sales by Customer';
      else if (filterType === 'book') reportName = 'Sales by Book';
      else if (filterType === 'supplier') reportName = 'Sales by Supplier';
      else if (filterType === 'overall' && viewMode === 'graph') reportName = 'Sales Summary Over Time';

      const response = await reportApi.generateReport(reportName, startDate, endDate);

      if (detailedView) {
        const rawDataResponse = await reportApi.generateReport(`${reportName} (RAW)`, startDate, endDate);
        setRawData(rawDataResponse.data || []);
      } else {
        setRawData([]); // Clear raw data if detailed view is disabled
      }

      setReportResult(response.data || []);
    } catch (error) {
      console.error("Failed to generate report:", error);
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

  const columns = Object.keys(reportResult[0] || {}).map((key) => {
    const isCurrencyField =
      key.toLowerCase().includes('sales') ||
      key.toLowerCase().includes('value') ||
      key.toLowerCase().includes('amount');

    const isNumericField =
      key.toLowerCase().includes('total') ||
      key.toLowerCase().includes('count') ||
      typeof reportResult[0][key] === 'number';

    return {
      field: key,
      headerName: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // Make headers prettier
      flex: 1,
      valueFormatter: ({ value }) => {
        if (isCurrencyField && typeof value === 'number') {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value);
        }

        if (isNumericField && typeof value === 'number') {
          return new Intl.NumberFormat('en-US').format(value);
        }

        return value;
      }
    };
  });

  const rows = reportResult.map((row, i) => {
    const formattedRow = { id: i };

    for (const [key, value] of Object.entries(row)) {
      const lowerKey = key.toLowerCase();

      if (
        (lowerKey.includes('sales') || lowerKey.includes('value') || lowerKey.includes('amount') || lowerKey.includes('spent')) &&
        !isNaN(value)
      ) {
        // Format as currency
        formattedRow[key] = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(Number(value));
      } else if (
        (lowerKey.includes('total') || lowerKey.includes('count') || lowerKey.includes('orders')) &&
        !isNaN(value)
      ) {
        // Format as plain number with commas
        formattedRow[key] = new Intl.NumberFormat('en-US').format(Number(value));
      } else {
        // Leave other values as-is
        formattedRow[key] = value;
      }
    }

    return formattedRow;
  });






  const renderBookSummary = () => {
    const topBooks = reportResult.slice(0, 3);
    return (
      <>
        <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>Top 3 Books</Typography>
        <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
          {topBooks.map((book, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Title:</strong> {book.BookTitle || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Category:</strong> {book.Category || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Total Sales:</strong> ${book.TotalSales != null ? book.TotalSales.toFixed(2) : '0.00'}</Typography>
              <Typography variant="body2"><strong>Total Orders:</strong> {book.TotalOrders ?? 0}</Typography>
              <Typography variant="body2"><strong>Total Quantity Sold:</strong> {book.TotalQuantity ?? 0}</Typography>
              <Typography variant="body2"><strong>Avg Quantity Per Invoice:</strong> {book.AvgQuantityPerInvoiceItem != null ? book.AvgQuantityPerInvoiceItem.toFixed(2) : '0.00'}</Typography>
            </Box>
          ))}
        </Paper>
      </>
    );
  };

  const renderSupplierSummary = () => {
    const supplierMap = {};

    reportResult.forEach(entry => {
      const supplier = entry.SupplierName || 'Unknown Supplier';
      const book = entry.BookTitle || 'Untitled';
      const category = entry.Category || 'Uncategorized';
      const sales = Number(entry.TotalSales || 0);

      if (!supplierMap[supplier]) {
        supplierMap[supplier] = {
          totalSales: 0,
          books: {}
        };
      }

      supplierMap[supplier].totalSales += sales;

      if (!supplierMap[supplier].books[book]) {
        supplierMap[supplier].books[book] = {
          title: book,
          category: category,
          sales: 0
        };
      }

      supplierMap[supplier].books[book].sales += sales;
    });

    const topSuppliers = Object.entries(supplierMap)
      .map(([name, data]) => ({
        name,
        totalSales: data.totalSales,
        topBooks: Object.values(data.books)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 3)
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 3);

    return (
      <>
        <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>Top 3 Suppliers</Typography>
        <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
          {topSuppliers.map((supplier, idx) => (
            <Box key={idx} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                {supplier.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Total Sales:</strong> {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(supplier.totalSales)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                Top 3 books sold by this supplier during the selected date range:
              </Typography>
              <Box sx={{ pl: 2 }}>
                {supplier.topBooks.map((book, bIdx) => (
                  <Box key={bIdx} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      📚 <strong>{book.title}</strong>
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong> {book.category}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Sales:</strong> {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(book.sales)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Paper>
      </>
    );
  };

  // This should be defined at the same level as renderBookSummary, renderSupplierSummary, etc.
  const renderRawDataTable = () => {
    if (!detailedView || rawData.length === 0) return null;

    const rawColumns = Object.keys(rawData[0] || {}).map(key => {
      // Check for specific fields that should be formatted as currency
      const isCurrencyField =
        key === 'Price' ||
        key === 'LineItemAmount' ||
        key === 'InvoiceTotal' ||
        key === 'ItemTotal' ||
        key.endsWith('Price') ||
        key.endsWith('Amount') ||
        key.includes('Total') && !key.includes('Quantity');

      // Identify quantity fields - useful for distinguishing from other numbers
      const isQuantityField =
        key === 'Quantity' ||
        key.endsWith('Quantity') ||
        key.includes('Count') ||
        key.includes('Units');

      // Define appropriate width based on column content type
      let width;
      if (key.includes('Id')) {
        width = 220;
      } else if (key.includes('Date')) {
        width = 120;
      } else if (key.includes('Title') || key.includes('Author')) {
        width = 180;
      } else if (isCurrencyField || key.includes('Quantity')) {
        width = 120;
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

  const renderGraph = () => {
    if (filterType === 'overall') {
      const monthlyTotals = {};

      reportResult.forEach((entry) => {
        const rawDate = entry.Date;
        const totalSales = Number(entry.TotalSales);

        if (!rawDate || isNaN(new Date(rawDate)) || isNaN(totalSales)) return;

        const date = new Date(rawDate);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`; // e.g. "2024-04"

        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = {
            month: monthKey,
            TotalSales: 0
          };
        }

        monthlyTotals[monthKey].TotalSales += totalSales;
      });

      const aggregatedData = Object.values(monthlyTotals).sort((a, b) =>
        a.month.localeCompare(b.month)
      );

      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="month"
              stroke="#ccc"
              interval="preserveStartEnd" // reduce crowding dynamically
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  year: '2-digit'
                }).format(new Date(year, month - 1));
              }}
              label={{ value: "Month", position: "insideBottom", offset: -40, fill: "#ccc" }}
            />
            <YAxis
              stroke="#ccc"
              label={{
                value: "Total Sales ($)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#ccc"
              }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }}
              labelFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long'
                }).format(new Date(year, month - 1));
              }}
              formatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(value)
              }
            />
            <Line
              type="monotone"
              dataKey="TotalSales"
              stroke="#8499D9"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (filterType === 'customer') {
      const key = filterType === 'customer' ? 'CustomerName' : 'SupplierName';
      const valueKey = filterType === 'customer' ? 'TotalSpent' : 'TotalSales';
      const graphData = topCount === 'All' ? reportResult : reportResult.slice(0, topCount);

      return (
        <Box sx={{ overflowX: 'auto' }}>
          <ResponsiveContainer width={Math.max(600, graphData.length * 100)} height={400}>
            <BarChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barCategoryGap="20%">
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis
                dataKey={key}
                stroke="#ccc"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                minTickGap={10}
              />
              <YAxis
                stroke="#ccc"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
                contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey={valueKey} fill="#8499D9" radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey={valueKey}
                  position="top"
                  fill="#fff"
                  formatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(value)
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      );
    }

    if (filterType === 'supplier') {
      const supplierTotals = {};

      reportResult.forEach(entry => {
        const name = entry.SupplierName || 'Unknown Supplier';
        const sales = Number(entry.TotalSales || 0);
        if (!supplierTotals[name]) {
          supplierTotals[name] = 0;
        }
        supplierTotals[name] += sales;
      });

      const graphData = Object.entries(supplierTotals)
        .map(([name, totalSales]) => ({ SupplierName: name, TotalSales: totalSales }))
        .sort((a, b) => b.TotalSales - a.TotalSales);

      const displayedData = topCount === 'All' ? graphData : graphData.slice(0, topCount);

      return (
        <Box sx={{ overflowX: 'auto' }}>
          <ResponsiveContainer width={Math.max(600, displayedData.length * 100)} height={400}>
            <BarChart data={displayedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barCategoryGap="20%">
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis
                dataKey="SupplierName"
                stroke="#ccc"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                minTickGap={10}
              />
              <YAxis
                stroke="#ccc"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
                contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="TotalSales" fill="#8499D9" radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="TotalSales"
                  position="top"
                  fill="#fff"
                  formatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(value)
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      );
    }


    else if (filterType === 'book') {
      const categoryTotals = {};

      reportResult.forEach((entry) => {
        const category = entry.Category || 'Uncategorized';
        const sales = Number(entry.TotalSales || 0);
        if (!categoryTotals[category]) {
          categoryTotals[category] = { name: category, value: 0 };
        }
        categoryTotals[category].value += sales;
      });

      const categoryData = Object.values(categoryTotals);
      const graphData = topCount === 'All' ? categoryData : categoryData.slice(0, topCount);

      return (
        <Box sx={{ overflowX: 'auto' }}>
          <ResponsiveContainer width={Math.max(600, graphData.length * 100)} height={400}>
            <BarChart
              data={graphData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            >
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis
                type="number"
                stroke="#ccc"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#ccc"
                width={200}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
                contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#21AFBF" radius={[0, 6, 6, 0]}>
                <LabelList
                  dataKey="value"
                  position="right"
                  fill="#fff"
                  formatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(value)
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      );
    }


    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4, overflowY: 'auto' }}>
        <Paper sx={{ p: 4, backgroundColor: '#2b2b2b', color: '#fff' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>Generate Sales Report</Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Filter Type"
                fullWidth
                value={filterType}
                onChange={(e) => {
                  const newType = e.target.value;
                  setFilterType(newType);
                  setReportResult([]);
                }}
                sx={{ backgroundColor: '#1f1f1f' }}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{ style: { color: '#fff' } }}
              >
                {filterOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setReportResult([]);
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ backgroundColor: '#1f1f1f' }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setReportResult([]);
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ backgroundColor: '#1f1f1f' }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => setRangeFromToday(1)}>Last 1M</Button>
                  <Button variant="outlined" onClick={() => setRangeFromToday(6)}>Last 6M</Button>
                  <Button variant="outlined" onClick={() => setRangeFromToday(12)}>Last 1Y</Button>
                </Stack>
                <Button variant="contained" color="primary" fullWidth onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Loading...' : 'Generate Report'}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#444' }} />

          <Box>
            <Typography variant="h6" gutterBottom>Report Preview</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ToggleButtonGroup
                color="primary"
                value={viewMode}
                exclusive
                onChange={(e, val) => {
                  if (val && val !== viewMode) {
                    setReportResult([]); // Clear the report data
                    setViewMode(val);    // Update the view mode
                  }
                }}
              >
                <ToggleButton value="summary">Summary</ToggleButton>
                <ToggleButton value="table">Table</ToggleButton>
                <ToggleButton value="graph">Graph</ToggleButton>
              </ToggleButtonGroup>

              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
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

            {viewMode === 'summary' && filterType === 'book' && reportResult.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  This report highlights the top-performing books based on total sales within the selected date range.
                  It helps identify which book categories and titles generate the most revenue, guiding decisions on restocking,
                  promotions, and customer preferences.
                </Typography>

                <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc', mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Report Summary</Typography>
                  <Typography variant="body2"><strong>Total Categories:</strong> {
                    new Set(reportResult.map(book => book.Category || 'Uncategorized')).size
                  }</Typography>
                  <Typography variant="body2"><strong>Total Unique Books:</strong> {
                    reportResult.length
                  }</Typography>
                  <Typography variant="body2"><strong>Total Sales:</strong> {
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(
                      reportResult.reduce((sum, book) => sum + (book.TotalSales || 0), 0)
                    )
                  }</Typography>
                </Paper>

                {renderBookSummary()}
                {renderRawDataTable()}
              </>
            )}

            {viewMode === 'summary' && filterType === 'supplier' && reportResult.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  This report shows which suppliers contribute the most to your sales. It helps identify key supplier partnerships,
                  track supply chain value, and support decisions around procurement, negotiations, and vendor prioritization.
                </Typography>

                <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc', mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Report Summary</Typography>
                  <Typography variant="body2"><strong>Total Suppliers:</strong> {
                    new Set(reportResult.map(s => s.SupplierName || 'Unknown')).size
                  }</Typography>
                  <Typography variant="body2"><strong>Total Sales Across All Suppliers:</strong> {
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(
                      reportResult.reduce((sum, s) => sum + (s.TotalSales || 0), 0)
                    )
                  }</Typography>
                </Paper>

                {renderSupplierSummary()}
                {renderRawDataTable()}
              </>
            )}


            {viewMode === 'graph' && ['customer', 'supplier'].includes(filterType) && reportResult.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>Show top:</Typography>
                <TextField
                  select
                  value={topCount}
                  onChange={(e) => setTopCount(e.target.value)}
                  size="small"
                  sx={{ width: 100, backgroundColor: '#1f1f1f' }}
                  InputProps={{ style: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                >
                  {topOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            )}

            {viewMode === 'summary' && filterType === 'customer' && reportResult.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  This report highlights the top-performing customers based on total spending within the selected date range.
                  It helps identify loyal and high-value customers, guiding retention strategies, personalized offers, and marketing focus.
                </Typography>

                <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>Top 3 Customers</Typography>
                <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
                  {reportResult.slice(0, 3).map((row, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      {Object.entries(row).map(([key, value]) => {
                        let formattedValue = value;
                        if (key.toLowerCase().includes('spent') || key.toLowerCase().includes('sales')) {
                          formattedValue = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(value);
                        } else if (typeof value === 'number') {
                          formattedValue = new Intl.NumberFormat('en-US').format(value);
                        }

                        return (
                          <Typography key={key} variant="body2">
                            <strong>{key}:</strong> {formattedValue}
                          </Typography>
                        );
                      })}
                    </Box>
                  ))}
                </Paper>
                {renderRawDataTable()}
              </>
            )}


            {viewMode === 'summary' && !['customer', 'book', 'supplier'].includes(filterType) && (
              <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
                {reportResult.length > 0 ? (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      This report provides a comprehensive overview of total sales, average order value, and total number of orders placed within the selected date range.
                      It is essential for tracking overall business performance, identifying revenue trends, and making informed decisions on marketing, inventory, and customer engagement strategies.
                    </Typography>

                    {reportResult.map((row, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        {Object.entries(row).map(([key, value]) => {
                          let formattedValue = value;
                          if (key.toLowerCase().includes('sales') || key.toLowerCase().includes('value')) {
                            formattedValue = new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(value);
                          } else if (typeof value === 'number') {
                            formattedValue = new Intl.NumberFormat('en-US').format(value);
                          }

                          return (
                            <Typography key={key} variant="body2">
                              <strong>{key}:</strong> {formattedValue}
                            </Typography>
                          );
                        })}
                      </Box>
                    ))}
                    {renderRawDataTable()}
                  </Box>
                ) : (
                  <Typography variant="body2">
                    Report data will be shown here after generation.
                  </Typography>
                )}
              </Paper>
            )}


            {viewMode === 'table' && reportResult.length > 0 && (
              <Box sx={{ backgroundColor: '#1a1a1a', p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ccc', mb: 1 }}>
                  Table View ({formatDate(startDate)} - {formatDate(endDate)})
                </Typography>
                <Box sx={{ height: 400 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
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
                      border: '1px solid #444'
                    }}
                  />


                </Box>
                {renderRawDataTable()}
              </Box>
            )}

            {viewMode === 'graph' && reportResult.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Graph View ({formatDate(startDate)} - {formatDate(endDate)})
                </Typography>
                {renderGraph()}
                {renderRawDataTable()}
              </Box>
            )}
          </Box>
        </Paper>
      </Box >
    </LocalizationProvider >
  );
};

export default SalesReports;
