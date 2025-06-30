import React, { useState } from "react";
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
  Pagination,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { FilterList, CalendarToday } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const TransactionHistory = ({ seller }) => {
  const initialTransactions = seller?.transactionHistory || [];
  const [transactions, setTransactions] = useState(initialTransactions);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const open = Boolean(anchorEl);

  // Function to format date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Function to get status color
  const getStatusColor = (settled) => {
    if (settled) {
      return { bg: "#DFF6DD", color: "#2E7D32", label: "Settled" };
    } else {
      return { bg: "#FFECD1", color: "#D84315", label: "Pending" };
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const filtered = initialTransactions.filter((transaction) =>
        dayjs(transaction.createdAt).isSame(formattedDate, "day")
      );
      setTransactions(filtered);
    } else {
      setTransactions(initialTransactions);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleStatusFilter = (event) => {
    const status = event.target.value;
    setFilterStatus(status);
    if (status === "") {
      setTransactions(initialTransactions);
    } else if (status === "Settled") {
      const filtered = initialTransactions.filter(
        (transaction) => transaction.settled
      );
      setTransactions(filtered);
    } else if (status === "Pending") {
      const filtered = initialTransactions.filter(
        (transaction) => !transaction.settled
      );
      setTransactions(filtered);
    }
  };

  const handleClearFilters = () => {
    setSelectedDate(null);
    setFilterStatus("");
    setTransactions(initialTransactions);
    handleFilterClose();
  };

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  InputProps: {
                    startAdornment: <CalendarToday sx={{ mr: 1 }} />,
                  },
                },
              }}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ textTransform: "none" }}
            onClick={handleFilterClick}
          >
            Filters
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleFilterClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem disabled>Filter By:</MenuItem>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={filterStatus}
                label="Status"
                onChange={handleStatusFilter}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Settled">Settled</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
            {(selectedDate || filterStatus) && (
              <MenuItem onClick={handleClearFilters} sx={{ color: "error" }}>
                Clear Filters
              </MenuItem>
            )}
          </Menu>
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
            {transactions?.length > 0 ? (
              transactions.map((row, index) => {
                const status = getStatusColor(row.settled);
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography
                        sx={{
                          color: "#3f51b5",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {row.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.items.map((item, idx) => (
                        <Typography
                          key={idx}
                          fontWeight="bold"
                          sx={{ mb: 0.5 }}
                        >
                          {item.productName}
                        </Typography>
                      ))}
                      {row.items.length > 1 && (
                        <Typography variant="body2" color="text.secondary">
                          +{row.items.length - 1} other product
                          {row.items.length - 1 > 1 ? "s" : ""}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>₹{row.totalVendorAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        sx={{
                          bgcolor: status.bg,
                          color: status.color,
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
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
        <Typography variant="body2">
          Showing {transactions?.length || 0} transactions
        </Typography>
        <Pagination count={1} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
};

export default TransactionHistory;