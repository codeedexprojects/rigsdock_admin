import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { styled } from '@mui/material/styles';
import { getAvailableYearsApi } from '../../../services/allApi';

const ChartContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1],
  marginTop: theme.spacing(3),
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          padding: '8px 12px',
          border: '1px solid #0A5FBF',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600 }}>
          ₹{payload[0].value.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
      </Box>
    );
  }
  return null;
};

const SalesGraph = ({ monthlySales }) => {
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await getAvailableYearsApi();
        if (response && Array.isArray(response.data)) {
          setAvailableYears(response.data);
        }
      } catch (error) {
        console.error('Error fetching available years:', error);
      }
    };

    fetchYears();
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Filter monthly sales based on selected year
  const filteredSales = monthlySales.filter((sale) => sale.month.startsWith(selectedYear));

  // Map filtered sales data
  const data = filteredSales.map((sale) => ({
    month: sale.monthName,
    value: sale.totalSales,
  }));

  return (
    <ChartContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Sales Overview
        </Typography>
        <Select value={selectedYear} onChange={handleYearChange} size="small" sx={{ minWidth: 100, fontSize: '0.875rem' }}>
          {availableYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#757575', fontSize: 12 }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#757575', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#1976d2" fill="url(#colorUv)" fillOpacity={1} />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor="rgba(78, 149, 242, 0.2)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.176942)" stopOpacity={1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </ChartContainer>
  );
};

export default SalesGraph;
