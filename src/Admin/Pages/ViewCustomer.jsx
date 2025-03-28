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
import { getCustomersApi } from "../../services/allApi";

const ViewCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;
  const [selectedRows, setSelectedRows] = useState([]);
  
  const handleRowClick = (orderId) => {
    setSelectedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((item) => item !== orderId)
        : [...prev, orderId]
    );
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await getCustomersApi();
        console.log(response);
        
        if (response.status === 200) {
          setCustomers(response.data);
          setFilteredCustomers(response.data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredCustomers.map((order) => order._id));
    } else {
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    let result = [...customers];
    
    if (filterBy !== "all") {
      const today = new Date();
      
      if (filterBy === "today") {
        const todayStr = today.toDateString();
        result = result.filter(cutomer => new Date(cutomer.createdAt).toDateString() === todayStr);
      } else if (filterBy === "week") {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        result = result.filter(cutomer => new Date(cutomer.createdAt) >= oneWeekAgo);
      } else if (filterBy === "month") {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        result = result.filter(cutomer => new Date(cutomer.createdAt) >= oneMonthAgo);
      } else if (filterBy === "Approved") {
        result = result.filter(cutomer => cutomer.status === "Approved");
      } else if (filterBy === "pending") {
        result = result.filter(cutomer => cutomer.status === "Pending");
      } else if (filterBy === "cancelled") {
        result = result.filter(customer => customer.status === "Cancelled");
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        customer => 
            customer._id.toLowerCase().includes(query) || 
        customer.username.toLowerCase().includes(query)
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
    
    setFilteredCustomers(result);
    setCurrentPage(1); 
  }, [customers, searchQuery, filterBy, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: "#DFEFDC",
          color: "#219653",
        };
      case "Pending":
        return {
          backgroundColor: "#e3f2fd",
          color: "#4E95F2",
        };
      case "Cancelled":
        return {
          backgroundColor: "#EB57571A",
          color: "#EB5757",
        };
      default:
        return "default";
    }
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
            Customer List
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
              <MenuItem value="all">All Customers</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
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
                      checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < currentItems.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#212B36", fontWeight: "bold" }}>
                    ALL CUSTOMER LIST
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    EMAIL
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    #ID
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    ORDERS
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "#212B36",
                      fontWeight: "bold",
                    }}
                  >
                    RATING
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
                  currentItems.map((customer) => (
                    <TableRow
                      key={customer._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          outline: "1px solid #0A5FBF",
                          borderRadius: 3,
                          transition: "outline 0.2s ease-in-out",
                        },
                        cursor: "pointer"
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(customer._id);
                        }}
                      >
                        <Checkbox
                          checked={selectedRows.includes(customer._id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowClick(customer._id);
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {customer.username}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {customer.email}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {customer._id}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {customer.items?.length ?? 0}
                      </TableCell>
                      <TableCell sx={{ color: "#0A5FBF", textAlign: "center" }}>
                       {customer.rating}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Chip
                          label={customer.status}
                          size="medium"
                          sx={{
                            ...getStatusChipColor(customer.status),
                            borderRadius: 1,
                            width: 98,
                            height: 35,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {filteredCustomers.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Paginations
                totalItems={filteredCustomers.length}
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

export default ViewCustomer;