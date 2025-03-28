import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  FormControl,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  CircularProgress,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Paginations from "../Components/SellerPage/Paginations";
import { getOrdersApi } from "../../services/allApi";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowClick = (orderId) => {
    setSelectedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((item) => item !== orderId)
        : [...prev, orderId]
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrdersApi();
        console.log(response);

        if (response.status === 200) {
          setOrders(response.data.orders);
          setFilteredOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredOrders.map((order) => order._id));
    } else {
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    let result = [...orders];

    if (filterBy !== "all") {
      const today = new Date();

      if (filterBy === "today") {
        const todayStr = today.toDateString();
        result = result.filter(
          (order) => new Date(order.createdAt).toDateString() === todayStr
        );
      } else if (filterBy === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        result = result.filter(
          (order) => new Date(order.createdAt) >= oneWeekAgo
        );
      } else if (filterBy === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        result = result.filter(
          (order) => new Date(order.createdAt) >= oneMonthAgo
        );
      } else if (filterBy === "processing") {
        result = result.filter((order) => order.orderStatus === "Processing");
      } else if (filterBy === "shipped") {
        result = result.filter((order) => order.orderStatus === "Shipped");
      } else if (filterBy === "delivered") {
        result = result.filter((order) => order.orderStatus === "Delivered");
      } else if (filterBy === "cancelled") {
        result = result.filter((order) => order.orderStatus === "Cancelled");
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(query) ||
          order.user.username.toLowerCase().includes(query)
      );
    }

    if (sortBy === "date-newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "date-oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "price-highest") {
      result.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === "price-lowest") {
      result.sort((a, b) => a.totalPrice - b.totalPrice);
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [orders, searchQuery, filterBy, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusChipColor = (orderStatus) => {
    switch (orderStatus) {
      case "Completed":
        return {
          backgroundColor: "#DFEFDC",
          color: "#219653",
        };
      case "Processing":
        return {
          backgroundColor: "#e3f2fd",
          color: "#4E95F2",
        };
      case "Shipped":
        return {
          backgroundColor: "#FFF3CD",
          color: "#FF9900",
        };
      case "Delivered":
        return {
          backgroundColor: "#D1E7DD",
          color: "#0F5132",
        };
      case "Cancelled":
        return {
          backgroundColor: "#EB57571A",
          color: "#EB5757",
        };
      default:
        return {
          backgroundColor: "#F0F0F0",
          color: "#333333",
        };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ paddingX: 5, paddingY: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 3,
            gap: 5,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ pl: 2 }}
            fontWeight="bold"
          >
            Orders
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              value={filterBy}
              size="small"
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography color="#92929D">Sort by:</Typography>
          <Select
            value={sortBy}
            size="small"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="date-newest">Date (Newest)</MenuItem>
            <MenuItem value="date-oldest">Date (Oldest)</MenuItem>
            <MenuItem value="price-highest">Price (Highest)</MenuItem>
            <MenuItem value="price-lowest">Price (Lowest)</MenuItem>
          </Select>
          <IconButton>
            <FilterAltOutlinedIcon sx={{ color: "#9FA3A8" }} />
          </IconButton>
        </Box>
      </Box>
      <Paper
        elevation={0}
        sx={{ mb: 4, display: "flex", alignItems: "center", p: 1, gap: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Search by customer name, and order number"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3.06,
              height: 45,
              "& fieldset": { borderColor: "#DFDFDF" },
              "&:hover fieldset": { borderColor: "#9e9999" },
              "&.Mui-focused fieldset": { borderColor: "#9e9999" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            sx={{
              borderRadius: 3.06,
              height: 45,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#9e9999",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#DFDFDF",
              },
            }}
            defaultValue="name"
            variant="outlined"
          >
            <MenuItem value="name">Action</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{
              px: 1,
              py: 1,
              boxShadow: "none",
              "& .MuiTableCell-root": { border: "none" },
              "& .MuiTableHead-root": {
                "& .MuiTableRow-root": {
                  borderRadius: "10px",
                  overflow: "hidden",
                  "& .MuiTableCell-root:first-of-type": {
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                  },
                  "& .MuiTableCell-root:last-child": {
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                  },
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F4F4F4" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selectedRows.length === currentItems.length &&
                        currentItems.length > 0
                      }
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < currentItems.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#212B36", fontWeight: "bold" }}>
                    ORDER NUMBER
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    CUSTOMER
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    DATE
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    ITEMS
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    PRICE
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    PAYMENT STATUS
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    STATUS
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No orders found matching your criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((order) => (
                    <TableRow
                      key={order._id}
                      onClick={() => navigate(`/orderDetails/${order._id}`)}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          outline: "1px solid #0A5FBF",
                          borderRadius: 3,
                          transition: "outline 0.2s ease-in-out",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(order._id);
                        }}
                      >
                        <Checkbox
                          checked={selectedRows.includes(order._id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowClick(order._id);
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {order._id.slice(0, 10)}...
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                      {order?.user?.name || "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {order.items?.length ?? 0}
                      </TableCell>
                      <TableCell sx={{ color: "#0A5FBF", textAlign: "center" }}>
                        {Number(order.totalPrice).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Chip
                          label={order.paymentStatus}
                          size="medium"
                          sx={{
                            ...getStatusChipColor(order.paymentStatus),
                            borderRadius: 1,
                            width: 98,
                            height: 35,
                          }}
                        />
                      </TableCell>
                      
                      <TableCell sx={{ textAlign: "center" }}>
                        <Chip
                          label={order.orderStatus}
                          size="medium"
                          sx={{
                            ...getStatusChipColor(order.orderStatus),
                            borderRadius: 1,
                            width: 98,
                            height: 35,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredOrders.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Paginations
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default OrdersPage;
