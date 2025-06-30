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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { getOrdersApi } from '../../../services/allApi';

const TableContainer = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 24,
  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  marginTop: 24
});

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options).replace(',', ',');
};

// Helper function to format currency in Rupees
const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString()}`;
};

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const response = await getOrdersApi();
        console.log(response);

        if (response.status === 200) {
          // Transform order data to transaction format
          const transformedTransactions = response.data.orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8)
            .map((order) => {
              // Determine transaction status icon
              let icon;
              if (order.paymentStatus === "Completed" || order.paymentStatus === "Paid") {
                icon = <CheckCircleIcon sx={{ color: '#0A5FBF' }} />;
              } else if (order.paymentStatus === "Pending") {
                icon = <ErrorIcon sx={{ color: '#FFC107' }} />;
              } else {
                icon = <CancelIcon sx={{ color: '#EB5757' }} />;
              }

              // Determine transaction type
              const type = order.paymentStatus === "Refunded" ? "refund" : "payment";

              // Create a short ID from the order ID
              const shortId = order._id.substring(order._id.length - 5).toUpperCase();

              return {
                id: shortId,
                mainOrderId: order.mainOrderId,
                orderId: order._id,
                type: type,
                status: order.paymentStatus === "Completed" || order.paymentStatus === "Paid" ? "completed" : "pending",
                amount: formatCurrency(order.finalTotalPrice || order.totalPrice),
                platformFee: order.platformFee ? formatCurrency(order.platformFee) : '₹0',
                date: formatDate(order.createdAt),
                updatedAt: formatDate(order.updatedAt),
                icon: icon,
                customerName: order.user?.name || "Customer",
                paymentMethod: order.paymentMethod || "N/A",
                orderStatus: order.orderStatus,
                settled: order.settled,
                shiprocketOrderId: order.shiprocketOrderId,
                shiprocketShipmentId: order.shiprocketShipmentId
              };
            });

          setTransactions(transformedTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
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

        {loading ? (
          <Typography sx={{ textAlign: 'center', py: 4 }}>Loading transactions...</Typography>
        ) : transactions.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4 }}>No transactions found</Typography>
        ) : (
          <Table sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f0f0f0' } }}>
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
                <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>PAYMENT DETAILS</TableCell>
                <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>DATE & TIME</TableCell>
                <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>AMOUNT</TableCell>
                <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>PAYMENT STATUS</TableCell>
                <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>ORDER STATUS</TableCell>
                <TableCell sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>PAYMENT METHOD</TableCell>
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
                          ? `Payment from ${transaction.customerName} #${transaction.id}` 
                          : transaction.type === 'refund'
                          ? `Refund to ${transaction.customerName} #${transaction.id}`
                          : `Payment failed from ${transaction.customerName} #${transaction.id}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{transaction.date}</Typography>
                    <Typography variant="caption" color="textSecondary">Updated: {transaction.updatedAt}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{transaction.amount}</Typography>
                    <Typography variant="caption" color="textSecondary">Fee: {transaction.platformFee}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status === 'completed' ? 'Completed' : 'Pending'} 
                      sx={{
                        width: 90,
                        height: 28, 
                        bgcolor: transaction.status === 'completed' ? '#e3f2fd' : '#fff8e1',
                        color: transaction.status === 'completed' ? '#2196f3' : '#ffa000',
                        borderRadius: 1,
                      }} 
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      {transaction.settled ? 'Settled' : 'Unsettled'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.orderStatus} 
                      sx={{
                        minWidth: 90,
                        height: 28, 
                        bgcolor: 
                          transaction.orderStatus === 'Delivered' ? '#e8f5e9' :
                          transaction.orderStatus === 'Processing' ? '#e3f2fd' :
                          transaction.orderStatus === 'Shipped' ? '#e0f7fa' : '#f3e5f5',
                        color: 
                          transaction.orderStatus === 'Delivered' ? '#4caf50' :
                          transaction.orderStatus === 'Processing' ? '#2196f3' :
                          transaction.orderStatus === 'Shipped' ? '#00bcd4' : '#9c27b0',
                        borderRadius: 1,
                      }} 
                    />
                    {transaction.shiprocketOrderId && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <LocalShippingIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="textSecondary">
                          {transaction.shiprocketOrderId.substring(0, 5)}...
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.paymentMethod} 
                      size="small"
                      sx={{
                        height: 24, 
                        bgcolor: transaction.paymentMethod === 'COD' ? '#fff3e0' : '#e8eaf6',
                        color: transaction.paymentMethod === 'COD' ? '#e65100' : '#3f51b5',
                        borderRadius: 1,
                      }} 
                    />
                  </TableCell>
                
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

       
      </TableContainer>
    </Box>
  );
};

export default TransactionDashboard;