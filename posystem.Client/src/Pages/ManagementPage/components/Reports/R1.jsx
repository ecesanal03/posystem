import React, { useState } from 'react';
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

  const handleGenerate = async () => {
    try {
      setLoading(true);
      let reportName = 'Sales Summary Report';
      if (filterType === 'customer') reportName = 'Sales by Customer';
      else if (filterType === 'book') reportName = 'Sales by Book';
      else if (filterType === 'supplier') reportName = 'Sales by Supplier';
      else if (filterType === 'overall' && viewMode === 'graph') reportName = 'Sales Summary Over Time'; 

      const response = await reportApi.generateReport(reportName, startDate, endDate);
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

  const columns = Object.keys(reportResult[0] || {}).map(key => ({
    field: key,
    headerName: key,
    flex: 1
  }));

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
    const topSuppliers = reportResult.slice(0, 3);
    return (
      <>
        <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>Top 3 Suppliers</Typography>
        <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
          {topSuppliers.map((supplier, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Supplier:</strong> {supplier.SupplierName || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Total Sales:</strong> ${supplier.TotalSales != null ? supplier.TotalSales.toFixed(2) : '0.00'}</Typography>
            </Box>
          ))}
        </Paper>
      </>
    );
  };
  

  const renderGraph = () => {
    if (filterType === 'overall') {
      const graphData = reportResult
        .map((entry) => {
          const rawDate = entry.Date;
          if (!rawDate) return null;

          const date = new Date(rawDate);
          if (isNaN(date)) return null;

          return {
            ...entry,
            FormattedDate: date.toISOString().split('T')[0],
          };
        })
        .filter((entry) => entry !== null);

        console.log("✅ Final graph data:", graphData);

      if (graphData.length === 1) {
        const cloneDate = new Date(graphData[0].FormattedDate);
        cloneDate.setDate(cloneDate.getDate() - 1);
        graphData.unshift({
          ...graphData[0],
          TotalSales: 0,
          FormattedDate: cloneDate.toISOString().split('T')[0]
        });
      }

      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="FormattedDate"
              stroke="#ccc"
              angle={-45}
              textAnchor="end"
              interval={0}
              tickFormatter={(value) => {
                const date = new Date(value);
                return isNaN(date)
                  ? ''
                  : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
              }}
              label={{ value: "Date", position: "insideBottom", offset: -40, fill: "#ccc" }}
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
                const date = new Date(value);
                return isNaN(date)
                  ? ''
                  : new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }).format(date);
              }}
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

    if (filterType === 'customer' || filterType === 'supplier') {
      const key = filterType === 'customer' ? 'CustomerName' : 'SupplierName';
      const valueKey = filterType === 'customer' ? 'TotalSpent' : 'TotalSales';
      const graphData = topCount === 'All' ? reportResult : reportResult.slice(0, topCount);
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid stroke="#444" strokeDasharray="3 3" />
            <XAxis dataKey={key} stroke="#ccc" angle={-45} textAnchor="end" interval={0} />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }} labelStyle={{ color: "#fff" }} />
            <Bar dataKey={valueKey} fill="#8499D9" radius={[6, 6, 0, 0]}>
              <LabelList dataKey={valueKey} position="top" fill="#fff" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (filterType === 'book') {
      const categoryData = reportResult.reduce((acc, row) => {
        const existing = acc.find(x => x.name === row.Category);
        if (existing) existing.value += row.TotalSales;
        else acc.push({ name: row.Category, value: row.TotalSales });
        return acc;
      }, []);

      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              label={({ name }) => name}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    return null;
  };

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
                onChange={(e) => setFilterType(e.target.value)}
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
                onChange={(newValue) => setStartDate(newValue)}
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
                onChange={(newValue) => setEndDate(newValue)}
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

            <ToggleButtonGroup
              color="primary"
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="summary">Summary</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
              <ToggleButton value="graph">Graph</ToggleButton>
            </ToggleButtonGroup>
            
            {viewMode === 'summary' && filterType === 'book' && reportResult.length > 0 && renderBookSummary()}
            {viewMode === 'summary' && filterType === 'supplier' && reportResult.length > 0 && renderSupplierSummary()}

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
                <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>Top 3 Customers</Typography>
                <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
                  {reportResult.slice(0, 3).map((row, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      {Object.entries(row).map(([key, value]) => (
                        <Typography key={key} variant="body2">
                          <strong>{key}:</strong> {value}
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </Paper>
              </>
            )}

              {viewMode === 'summary' && !['customer', 'book'].includes(filterType) && (
              <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#ccc' }}>
                {reportResult.length > 0 ? (
                  <Box>
                    {reportResult.map((row, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        {Object.entries(row).map(([key, value]) => (
                          <Typography key={key} variant="body2">
                            <strong>{key}:</strong> {value}
                          </Typography>
                        ))}
                      </Box>
                    ))}
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
                    rows={reportResult.map((r, i) => ({ id: i, ...r }))}
                    columns={columns}
                    sx={{ color: '#fff' }}
                  />
                </Box>
              </Box>
            )}

            {viewMode === 'graph' && reportResult.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Graph View ({formatDate(startDate)} - {formatDate(endDate)})
                </Typography>
                {renderGraph()}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default SalesReports;
