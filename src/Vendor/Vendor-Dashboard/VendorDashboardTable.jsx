import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Select,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { Link } from "react-router-dom";
import { getvendorOrdersApi } from "../../services/allApi";

const TableContainer = styled(Box)({
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 24,
  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  marginTop: 24,
});



const StatusChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgba(0, 102, 204, 0.1)",
  color: "#0066CC",
  borderRadius: 5,
  height: 31,
}));

const VendorDashboardTable = () => {
  const [orders, setOrders] = useState([]);



  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getvendorOrdersApi();
      console.log("orders", response);
  
      if (response.status === 200 && Array.isArray(response.data.orders)) {
        const sortedOrders = response.data.orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);
        setOrders(sortedOrders);
      } else {
        setOrders([]); // Ensure orders state is always an array
      }
    };
  
    fetchOrders();
  }, []);
  

  return (
    <Box sx={{ display: "flex", gap: 3, px: 3, py: 2 }}>
      <TableContainer sx={{ flex: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Incoming Orders
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              defaultValue="today"
              size="small"
              sx={{
                minWidth: 80,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </Box>
        </Box>
        <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>
            Customer
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>
            Order I.D
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>
            Payment
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>
            Quantity
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>
            Status
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {order?.user?.name?.charAt(0) || order?.user?.username?.charAt(0) || 'U'}
                </Avatar>
                {order?.user?.name || order?.user?.username || "N/A"}
              </Box>
            </TableCell>
            <TableCell>
              {order._id}
            </TableCell>
            <TableCell>
              {order.finalTotalPrice ? `₹${order.finalTotalPrice.toLocaleString()}` : order.payment || 'N/A'}
            </TableCell>
            <TableCell>
              {order.items?.length ?? 0}
            </TableCell>
            <TableCell>
              <StatusChip label={order.paymentStatus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

        <Link to={"/vendor-orders"}>
          <Button sx={{ mt: 2, color: "#0066CC" }} fullWidth>
            VIEW MORE ORDERS
          </Button>
        </Link>
      </TableContainer>

     
    </Box>
  );
};

export default VendorDashboardTable;
