import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  getTopSellingproductApi,
  getvendorOrdersApi,
} from "../../services/allApi";

const TableContainer = styled(Paper)({
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 24,
  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  marginBottom: 24,
  overflow: "hidden",
});

const ScrollableTableContainer = styled(Box)({
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c1c1c1",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "#a8a8a8",
    },
  },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
};

// Helper function to format currency in Rupees
const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString()}`;
};

const VendorDTable = () => {
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSales, setTopSales] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getvendorOrdersApi();

        if (response?.status === 200) {
          // Transform order data to transaction format
          const transformedTransactions = response.data.orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order) => {
              // Generate short order ID
              const shortOrderId = order._id
                .substring(order._id.length - 6)
                .toUpperCase();

              // Determine status and icon
              let status, icon;
              if (
                order.paymentStatus === "Completed" ||
                order.paymentStatus === "Paid"
              ) {
                status = "completed";
                icon = <CheckCircleIcon sx={{ color: "#0A5FBF" }} />;
              } else if (order.paymentStatus === "Pending") {
                status = "pending";
                icon = <ErrorIcon sx={{ color: "#FFA500" }} />;
              } else {
                status = "declined";
                icon = <CancelIcon sx={{ color: "#EB5757" }} />;
              }

              // Determine transaction type
              const type =
                order.paymentMethod === "Refund" ? "refund" : "payment";

              // Format amount
              const amount =
                type === "refund"
                  ? `-${formatCurrency(
                      order.finalTotalPrice || order.totalPrice
                    )}`
                  : formatCurrency(order.finalTotalPrice || order.totalPrice);

              return {
                id: `#${shortOrderId}`,
                orderId: order.mainOrderId,
                type,
                status,
                amount,
                date: formatDate(order.createdAt),
                icon,
                paymentMethod: order.paymentMethod,
                orderStatus: order.orderStatus,
                customerName: order.user?.name || "Unknown Customer",
                itemsTotal: order.itemsTotal,
                platformFee: order.platformFee,
                settled: order.settled,
              };
            });

          setTransactions(transformedTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // Set some example data for fallback
        setTransactions([
          {
            id: "#48696",
            type: "payment",
            status: "completed",
            amount: "₹25,000",
            date: "Mar 21, 2019, 3:30pm",
            icon: <CheckCircleIcon sx={{ color: "#0A5FBF" }} />,
            paymentMethod: "COD",
            orderStatus: "Delivered",
            customerName: "John Doe",
            settled: false,
          },
          {
            id: "#48698",
            type: "refund",
            status: "pending",
            amount: "-₹25,500",
            date: "Mar 21, 2019, 3:30pm",
            icon: <ErrorIcon sx={{ color: "#FFA500" }} />,
            paymentMethod: "Online",
            orderStatus: "Refunded",
            customerName: "Jane Smith",
            settled: true,
          },
          {
            id: "#48697",
            type: "payment",
            status: "declined",
            amount: "₹25,000",
            date: "Mar 21, 2019, 3:30pm",
            icon: <CancelIcon sx={{ color: "#EB5757" }} />,
            paymentMethod: "COD",
            orderStatus: "Cancelled",
            customerName: "Sam Wilson",
            settled: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await getTopSellingproductApi();
        if (response?.data?.success) {
          const transformedData = response.data.topSellingProducts.map(
            (item) => ({
              id: item.product._id,
              sales: item.totalQuantity,
              name: item.product.name,
              trending:
                item.totalQuantity > 1000
                  ? "up"
                  : item.totalQuantity > 500
                  ? "right"
                  : "down",
            })
          );
          setTopSales(transformedData);
        }
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
        // Set some example data for fallback
        setTopSales([
          { id: "1", name: "Product A", sales: 1200, trending: "up" },
          { id: "2", name: "Product B", sales: 800, trending: "right" },
          { id: "3", name: "Product C", sales: 450, trending: "down" },
        ]);
      }
    };

    fetchTopSellingProducts();
  }, []);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { bg: "#e3f2fd", text: "#2196f3" };
      case "pending":
        return { bg: "#fff8e1", text: "#ffa000" };
      case "declined":
        return { bg: "#ffebee", text: "#f44336" };
      default:
        return { bg: "#e8eaf6", text: "#3f51b5" };
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "declined":
        return "Declined";
      default:
        return "Unknown";
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Transaction History Section */}
      <TableContainer elevation={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Transaction History
          </Typography>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ScrollableTableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#FAFAFB",
                    "& th": {
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    },
                    "& th:first-of-type": {
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    },
                    "& th:last-of-type": {
                      borderTopRightRadius: "8px",
                      borderBottomRightRadius: "8px",
                    },
                  }}
                >
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Order Status</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Settlement</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => {
                  const statusColor = getPaymentStatusColor(transaction.status);

                  return (
                    <TableRow
                      key={transaction.id}
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {transaction.icon}
                          <Box sx={{ ml: 1 }}>
                            <Typography sx={{ fontWeight: "medium" }}>
                              {transaction.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.paymentMethod}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: "medium" }}>
                          {transaction.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              transaction.type === "refund"
                                ? "#f44336"
                                : "#0a5fbf",
                            fontWeight: "medium",
                          }}
                        >
                          {transaction.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          {transaction.orderStatus}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getPaymentStatusLabel(transaction.status)}
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            bgcolor: statusColor.bg,
                            color: statusColor.text,
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.settled ? "Settled" : "Pending"}
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            bgcolor: transaction.settled ? "#e8f5e9" : "#fff8e1",
                            color: transaction.settled ? "#4caf50" : "#ffa000",
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollableTableContainer>
        )}

        
      </TableContainer>

      {/* Top Selling Products Section */}
      <TableContainer elevation={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
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
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            variant="outlined"
          >
            <MenuItem value="October">October</MenuItem>
            <MenuItem value="November">November</MenuItem>
            <MenuItem value="December">December</MenuItem>
          </Select>
        </Box>

        {/* List Section */}
        {topSales.length > 0 ? (
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
                    {product.trending === "up" && (
                      <ArrowDropUpIcon sx={{ color: "#2196f3" }} />
                    )}
                    {product.trending === "down" && (
                      <ArrowDropDownIcon sx={{ color: "#f44336" }} />
                    )}
                    {product.trending === "right" && (
                      <ArrowRightIcon sx={{ color: "#757575" }} />
                    )}
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
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <Typography color="text.secondary">
              No products data available
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Container>
  );
};

export default VendorDTable;