import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
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
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { getvendorcouponApi } from "../../services/allApi";
import Paginations from "../../Admin/Components/SellerPage/Paginations";

const VendorCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const handleRowClick = (customer) => {
    setSelectedRows((prev) =>
      prev.includes(customer)
        ? prev.filter((item) => item !== customer)
        : [...prev, customer]
    );
  };
  console.log(selectedRows);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(coupons.map((order) => order.customer));
    } else {
      setSelectedRows([]);
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#DFEFDC",
          color: "#219653",
        };
      case "On the way":
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
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await getvendorcouponApi();
        console.log(response);

        if (response.success && response.data) {
          setCoupons(response.data);
          setFilteredCoupons(response.data); 
        } else {
          setError("Failed to fetch coupon data");
        }
      } catch (error) {
        setError("Error fetching coupons: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = coupons.filter(
      (coupon) =>
        coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoupons(filtered);
    setCurrentPage(1); 
  }, [searchQuery, coupons]);

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <Box sx={{ paddingX: 5, paddingY: 2 }}>
      {/* Header */}
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
            Coupons
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              value="today"
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
              <MenuItem value="today">All Coupon</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography color="#92929D">Sort by:</Typography>
          <Select
            value="today"
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
            <MenuItem value="today">Default</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>
          <IconButton>
            <FilterAltOutlinedIcon sx={{ color: "#9FA3A8" }} />
          </IconButton>
        </Box>
        <Link to="/vendor-add-coupon" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              padding: "8px 16px",
            }}
          >
            Add Coupon
          </Button>
        </Link>{" "}
      </Box>

      {/* Search Bar */}
      <Paper
        elevation={0}
        sx={{ mb: 4, display: "flex", alignItems: "center", p: 1, gap: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Search by Name, age, phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
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
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* {Table} */}
      {!loading && !error && (
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
                    checked={selectedRows.length === coupons.length}
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < coupons.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ color: "#212B36", fontWeight: "bold" }}>
                  COUPON NUMBER
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "#212B36",
                    fontWeight: "bold",
                  }}
                >
                  ITEM NAME
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
                  EXPIRE
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
                  STATUS
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentCoupons.map((coupon) => (
                <TableRow
                  key={coupon._id}
                  onClick={() => navigate(`/vendor-edit-coupon/${coupon._id}`)}

                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      outline: "1px solid #0A5FBF",
                      borderRadius: 3,
                      transition: "outline 0.2s ease-in-out",
                    },
                  }}
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedRows.includes(coupon.couponCode)}
                      onChange={() => handleRowClick(coupon.couponCode)}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {coupon.couponCode}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {coupon.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {coupon.validFrom}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {coupon.validTo}
                  </TableCell>
                  <TableCell sx={{ color: "#0A5FBF", textAlign: "center" }}>
                    {coupon.discountValue}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                      label={coupon.status}
                      size="medium"
                      sx={{
                        ...getStatusChipColor(coupon.status),
                        borderRadius: 1,
                        width: 98,
                        height: 35,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreHorizIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Paginations
        totalItems={filteredCoupons.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default VendorCoupon;
