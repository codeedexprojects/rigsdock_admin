import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Snackbar,
  Alert,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Paginations from "../Components/SellerPage/Paginations";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { deleteCouponApi, getcouponApi } from "../../services/allApi";
import dayjs from "dayjs";

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedCouponIds, setSelectedCouponIds] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 8;
  const [action, setAction] = useState("");


  const handleRowClick = (couponId) => {
    setSelectedCouponIds((prev) =>
      prev.includes(couponId)
        ? prev.filter((id) => id !== couponId)
        : [...prev, couponId]
    );
  };
  
  
  

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCouponIds(filteredCoupons.map((coupon) => coupon._id));
    } else {
      setSelectedCouponIds([]);
    }
  };
  
  
  const getStatusChipColor = (status) => {
    switch (status) {
      case "active":
        return {
          backgroundColor: "#DFEFDC",
          color: "#219653",
        };
      case "inactive":
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
        const response = await getcouponApi();
        console.log(response);

        if (response.success && response.data) {
          setCoupons(response.data);
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
  const filteredCoupons = useMemo(() => {
    let data = [...coupons];

    if (searchQuery) {
      data = data.filter(
        (coupon) =>
          coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coupon.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Apply date filter
    if (filterBy === "week") {
      data = data.filter((coupon) => new Date(coupon.createdAt) >= startOfWeek);
    } else if (filterBy === "month") {
      data = data.filter(
        (coupon) => new Date(coupon.createdAt) >= startOfMonth
      );
    }

    // Apply status filter
    if (filterBy === "active") {
      data = data.filter((coupon) => coupon.status === "active");
    } else if (filterBy === "inactive") {
      data = data.filter((coupon) => coupon.status === "inactive");
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "createdAt") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "updatedAt") {
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return data;
  }, [coupons, searchQuery, sortBy, filterBy]);

  const paginatedCoupons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCoupons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCoupons, currentPage, itemsPerPage]);

  const handleSortChange = useCallback((e) => setSortBy(e.target.value), []);

  const handleSearchChange = useCallback(
    (e) => setSearchQuery(e.target.value),
    []
  );

  const SnackbarAlert = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity="success" sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
  const handleOpenDeleteModal = () => {
    if (selectedCouponIds.length === 0) {
      alert("No coupons selected for deletion"); // Ensure this is not triggering falsely
      return;
    }
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setAction("");
  };
  const handleDeleteProduct = async () => {
    if (!selectedCouponIds.length) return;

    setIsDeleting(true);
    try {
      const response = await deleteCouponApi(selectedCouponIds);
      if (response.success) {
        setCoupons((prev) =>
          prev.filter((p) => !selectedCouponIds.includes(p._id))
        );
        setSelectedCouponIds([]);
        setSnackbar({
          open: true,
          message: `${selectedCouponIds.length} coupon${
            selectedCouponIds.length > 1 ? "s" : ""
          } deleted successfully!`,
        });
      } else {
        setSnackbar({
          open: true,
          message: response.error || "Deletion failed",
        });
      }
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}` });
    }
    setIsDeleting(false);
    handleCloseDeleteModal();
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="all">All Coupons</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </Box>

          <Typography color="#92929D">Sort by:</Typography>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            size="small"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="updatedAt">Updated Date</MenuItem>
          </Select>

          <IconButton>
            <FilterAltOutlinedIcon sx={{ color: "#9FA3A8" }} />
          </IconButton>
        </Box>
        <Link to="/addProduct" style={{ textDecoration: "none" }}>
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

      <Paper
        elevation={0}
        sx={{ mb: 4, display: "flex", alignItems: "center", p: 1, gap: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Search..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
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
            value={action}
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
            displayEmpty
            variant="outlined"
            onChange={(event) => {
              setAction(event.target.value);
              if (event.target.value === "delete") {
                handleOpenDeleteModal();
              }
            }}
          >
            <MenuItem value="">Action</MenuItem>
            <MenuItem value="edit">Edit</MenuItem>
            <MenuItem value="delete">Delete</MenuItem>
            <MenuItem value="export">Export</MenuItem>
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
                    checked={
                      selectedCouponIds.length === filteredCoupons.length &&
                      filteredCoupons.length > 0
                    }
                    indeterminate={
                      selectedCouponIds.length > 0 &&
                      selectedCouponIds.length < filteredCoupons.length
                    }
                    onChange={handleSelectAll}
                    disabled={filteredCoupons.length === 0}
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
              {paginatedCoupons.map((coupon) => (
                <TableRow
                  key={coupon._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      outline: "1px solid #0A5FBF",
                      borderRadius: 3,
                      transition: "outline 0.2s ease-in-out",
                    },
                  }}
                >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
  <Checkbox
    checked={selectedCouponIds.includes(coupon._id)}
    onChange={() => handleRowClick(coupon._id)}
  />
</TableCell>


                  <TableCell component="th" scope="row">
                    {coupon.couponCode}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {coupon.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {dayjs(coupon.validFrom).format(
                      "ddd, MMM DD, YYYY h:mm:ss A"
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {dayjs(coupon.validTo).format(
                      "ddd, MMM DD, YYYY h:mm:ss A"
                    )}
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
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>
          Delete {selectedCouponIds.length} Product
          {selectedCouponIds.length > 1 ? "s" : ""}?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {selectedCouponIds.length > 1
              ? `Are you sure you want to delete these ${selectedCouponIds.length} coupon? This action cannot be undone.`
              : "Are you sure you want to delete this coupon? This action cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarAlert />
      <Paginations
        totalItems={filteredCoupons.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default Coupon;
