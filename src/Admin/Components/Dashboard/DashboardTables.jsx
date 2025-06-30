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
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MoreHoriz } from "@mui/icons-material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { Link, useNavigate } from "react-router-dom";
import { getCustomersApi, getOrdersApi } from "../../../services/allApi";

const TableContainer = styled(Box)({
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 24,
  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  marginTop: 24,
});

const CustomerCard = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #eee",
});

const StatusChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgba(0, 102, 204, 0.1)",
  color: "#0066CC",
  borderRadius: 5,
  height: 31,
}));

const DashboardTables = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomersApi();
        console.log("customers", response);

        if (response.status === 200) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrdersApi();
      console.log(response);

      if (response.status === 200) {
        const sortedOrders = response.data.orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);
        setOrders(sortedOrders);
      }
    };

    fetchOrders();
  }, []);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/customers");
  };
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

        <Link to={"/orders"}>
          <Button sx={{ mt: 2, color: "#0066CC" }} fullWidth>
            VIEW MORE ORDERS
          </Button>
        </Link>
      </TableContainer>

      <TableContainer sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            New Customers
          </Typography>
          <IconButton size="small">
            <MoreHoriz />
          </IconButton>
        </Box>

        {customers.map((customer, index) => (
          <CustomerCard key={index}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {customer?.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer?.name ?? "User"}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  customer?.name?.charAt(0) ?? "U"
                )}
              </Avatar>

              <Box>
                <Typography variant="subtitle2">{customer.name}</Typography>
                <Typography variant="caption" color="#9FA3A8">
                  {customer.id}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small">
                <MailOutlineRoundedIcon
                  fontSize="small"
                  sx={{ color: "#9FA3A8" }}
                />
              </IconButton>
              <IconButton size="small">
                <BlockRoundedIcon fontSize="small" sx={{ color: "#EB5757" }} />
              </IconButton>
            </Box>
          </CustomerCard>
        ))}

        <Button
          onClick={handleClick}
          sx={{ mt: 2, color: "#0066CC" }}
          fullWidth
        >
          VIEW MORE CUSTOMERS
        </Button>
      </TableContainer>
    </Box>
  );
};

export default DashboardTables;
