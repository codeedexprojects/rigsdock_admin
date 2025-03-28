import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Pagination,
  Chip,
} from "@mui/material";
import { FilterList, CalendarToday } from "@mui/icons-material";

const transactions = [
  {
    orderId: "#302012",
    product: "Handmade Pouch",
    extra: "+3 other products",
    total: "$121.00",
    status: "Processing",
    statusColor: "orange",
    date: "12 Dec 2023",
  },
  {
    orderId: "#302011",
    product: "Smartwatch E2",
    extra: "+1 other product",
    total: "$590.00",
    status: "Processing",
    statusColor: "orange",
    date: "1 Dec 2023",
  },
  {
    orderId: "#302006",
    product: "Smartwatch E1",
    extra: "",
    total: "$125.00",
    status: "Shipped",
    statusColor: "blue",
    date: "10 Nov 2023",
  },
  {
    orderId: "#302001",
    product: "Headphone G1 Pro",
    extra: "+1 other product",
    total: "$348.00",
    status: "Shipped",
    statusColor: "blue",
    date: "2 Nov 2023",
  },
  {
    orderId: "#301998",
    product: "Iphone X",
    extra: "",
    total: "$607.00",
    status: "Delivered",
    statusColor: "green",
    date: "7 Sep 2023",
  },
];

const TransactionHistory = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Title and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Transaction History
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CalendarToday />}
            sx={{ textTransform: "none" }}
          >
            Select Date
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ textTransform: "none" }}
          >
            Filters
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ORDER ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>PRODUCT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TOTAL</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography
                    sx={{ color: "#3f51b5", cursor: "pointer", fontWeight: 500 }}
                  >
                    {row.orderId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">{row.product}</Typography>
                  {row.extra && (
                    <Typography variant="body2" color="text.secondary">
                      {row.extra}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    sx={{
                      bgcolor:
                        row.statusColor === "green"
                          ? "#DFF6DD"
                          : row.statusColor === "blue"
                          ? "#DDEAFB"
                          : "#FFECD1",
                      color:
                        row.statusColor === "green"
                          ? "#2E7D32"
                          : row.statusColor === "blue"
                          ? "#1565C0"
                          : "#D84315",
                      fontWeight: "bold",
                    }}
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="body2">Showing 1-5 from 1,296</Typography>
        <Pagination count={20} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
};

export default TransactionHistory;
