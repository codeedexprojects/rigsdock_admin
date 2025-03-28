import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { getTopSellingproductApi } from '../../services/allApi';

const TableContainer = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 24,
  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  marginTop: 24
});

const VendorDTable = () => {
    const [selectedMonth, setSelectedMonth] = useState("October");

  const transactions = [
    { id: '#48696', type: 'payment', status: 'completed', amount: '₦25,000', date: 'Mar 21, 2019, 3:30pm', icon: <CheckCircleIcon sx={{ color: '#0A5FBF' }} /> },
    { id: '#48698', type: 'refund', status: 'completed', amount: '-₦25,500', date: 'Mar 21, 2019, 3:30pm', icon: <ErrorIcon sx={{ color: '#0A5FBF' }} /> },
    { id: '#48697', type: 'payment', status: 'completed', amount: '₦25000', date: 'Mar 21, 2019, 3:30pm', icon: <CheckCircleIcon sx={{ color: '#0A5FBF' }} /> },
    { id: '#486966', type: 'payment', status: 'declined', amount: '₦75,000', date: 'Mar 21, 2019, 3:30pm', icon: <CancelIcon sx={{ color: '#EB5757' }} /> },
    { id: '#48699', type: 'payment', status: 'completed', amount: '₦35000', date: 'Mar 21, 2019, 3:30pm', icon: <CheckCircleIcon sx={{ color: '#0A5FBF' }} /> },
  ];

  const [topSales, setTopSales] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await getTopSellingproductApi();
        if (response.data.success) {
          const transformedData = response.data.topSellingProducts.map((item) => ({
            id: item.product._id,
            sales: item.totalQuantity,
            name: item.product.name,
            trending: item.totalQuantity > 1000 ? "up" : item.totalQuantity > 500 ? "right" : "down",
          }));
          setTopSales(transformedData);
        }
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
      }
    };

    fetchTopSellingProducts();
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 3, px: 3, py: 2 }}>
      {/* Transaction History Section */}
      <TableContainer sx={{ flex: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Transaction History
          </Typography>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Table sx={{ '& .MuiTableCell-root': { borderBottom: 'none'} }}>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: '#FAFAFB', 
              '& th': { paddingTop: '8px', paddingBottom: '8px' }, 
              width: '734.095px', 
              height: '34.994px', 
              borderRadius: '8.95px', 
              '& th:first-of-type': { borderTopLeftRadius: '8.95px', borderBottomLeftRadius: '8.95px' }, 
              '& th:last-of-type': { borderTopRightRadius: '8.95px', borderBottomRightRadius: '8.95px' }, 
            }}>
              <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>PAYMENT NUMBER</TableCell>
              <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>DATE & TIME</TableCell>
              <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>AMOUNT</TableCell>
              <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {transaction.icon}
                    <Typography sx={{ ml: 1 }}>
                      {transaction.type === 'payment' 
                        ? `Payment from ${transaction.id}` 
                        : transaction.type === 'refund'
                          ? `Process refund to ${transaction.id}`
                          : `Payment failed from ${transaction.id}`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <Chip 
                    label={transaction.status === 'completed' ? 'Completed' : 'Declined'} 
                    sx={{
                      width: 90,
                      height: 28, 
                      bgcolor: transaction.status === 'completed' ? '#e3f2fd' : '#ffebee',
                      color: transaction.status === 'completed' ? '#2196f3' : '#f44336',
                      borderRadius: 1,
                    }} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button 
          variant="text" 
          color="primary"
          sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold', width: '100%' }}
        >
          VIEW ALL TRANSACTIONS
        </Button>
      </TableContainer>

      <TableContainer sx={{ flex: 1 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Top Selling Products
        </Typography>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          sx={{
            fontSize: "0.9rem",
            color: "#9FA3A8",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
          variant="outlined"
        >
          <MenuItem value="October">October</MenuItem>
          <MenuItem value="November">November</MenuItem>
          <MenuItem value="December">December</MenuItem>
        </Select>
      </Box>

      {/* List Section */}
      <List sx={{ width: "100%" }}>
        {topSales.map((product) => (
          <ListItem
            key={product.id}
            secondaryAction={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    mr: 1,
                    color:
                      product.trending === "up"
                        ? "#2196f3"
                        : product.trending === "down"
                        ? "#f44336"
                        : "#757575",
                  }}
                >
                  {product.sales}
                </Typography>
                {product.trending === "up" && <ArrowDropUpIcon sx={{ color: "#2196f3" }} />}
                {product.trending === "down" && <ArrowDropDownIcon sx={{ color: "#f44336" }} />}
                {product.trending === "right" && <ArrowRightIcon sx={{ color: "#757575" }} />}
              </Box>
            }
            sx={{ py: 1 }}
          >
            <ListItemText
              primary={product.name}
              primaryTypographyProps={{ fontWeight: "medium" }}
            />
          </ListItem>
        ))}
      </List>
    </TableContainer>
    </Box>
  );
};

export default VendorDTable;