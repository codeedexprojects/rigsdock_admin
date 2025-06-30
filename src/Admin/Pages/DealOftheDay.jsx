import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  // CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { format } from "date-fns";
import { getdealofthedayApi } from "../../services/allApi";

const DealOftheDay = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Default");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
  }, []);

  const formatDate = (dateString) =>
    format(new Date(dateString), "dd MMM yyyy, HH:mm");

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getdealofthedayApi();
      console.log(response);

      setDeals(response.data);
      setFilteredDeals(response.data);
    } catch (err) {
      setError("Failed to fetch deals of the day. Please try again later.");
    }
    setLoading(false);
  };

  const handleSearch = useCallback(() => {
    if (!search) {
      setFilteredDeals(deals);
    } else {
      const filtered = deals.filter(
        (deals) =>
          deals.name.toLowerCase().includes(search.toLowerCase()) ||
          deals.description.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredDeals(filtered);
      setPage(1);
    }
  }, [search, deals]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleAddCategory = () => {
    navigate("/add-vendor-deal");
  };

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setDeleteId(null);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // const handleDelete = async () => {
  //   if (!deleteId) return;

  //   setIsLoading(true);

  //   try {
  //     const response = await deletevendordealofthedayApi(deleteId);

  //     if (response.success) {
  //       setFilteredDeals(deals.filter((item) => item._id !== deleteId));
  //       setFilteredDeals(
  //         filteredDeals.filter((deals) => deals._id !== deleteId)
  //       );

  //       // Show success notification
  //       showNotification("deal deleted successfully", "success");
  //     } else {
  //       // Show error notification
  //       showNotification("Failed to delete deal. Please try again.", "error");
  //     }
  //   } catch (error) {
  //     // Show error notification with specific error message if available
  //     showNotification(
  //       error.message || "Failed to delete deal. Please try again.",
  //       "error"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //     handleCloseConfirm();
  //   }
  // };

  const paginatedCategories = filteredDeals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // const handleEditClick = () => {
  //   navigate(`/edit-category/${deals._id}`);
  // };
  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Deal Of The Day List
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Show:</Typography>
          <Select defaultValue="All Products" variant="outlined" size="small">
            <MenuItem value="All Products">All Deal Of The Day</MenuItem>
            <MenuItem value="Category 1">Category 1</MenuItem>
            <MenuItem value="Category 2">Category 2</MenuItem>
          </Select>
          <Typography>Sort by:</Typography>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            defaultValue="Default"
            variant="outlined"
            size="small"
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
          </Select>

          {/* <Button
            onClick={handleAddCategory}
            variant="contained"
            startIcon={<Add />}
            sx={{ backgroundColor: "#1976D2", color: "white" }}
          >
            New Deal Of The Day
          </Button> */}
        </Box>
      </Box>
      {/* Search Bar */}
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search by Name, Deal, Variant etc..."
        sx={{ mb: 3 }}
      />
      {/* Categories Grid */}

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box mt={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && paginatedCategories.length === 0 && (
        <Box mt={3} textAlign="center">
          <Typography>No Deals found.</Typography>
        </Box>
      )}
      {!loading && !error && paginatedCategories.length > 0 && (
        <Grid container spacing={3}>
          {paginatedCategories.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" flexDirection="column" gap={1}>
                  {/* Name & ID */}
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography color="primary" variant="body2">
                      ID: {item._id}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>

                  {/* Product & Status */}
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        PRODUCT
                      </Typography>
                      <Typography variant="body2">
                        <b>{item.product?.name}</b>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Brand: {item.product?.brand}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        STATUS
                      </Typography>
                      <Typography variant="body2">
                        <b>{item.status}</b>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Created At & Expires At */}
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        CREATED AT
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(item.createdAt)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        EXPIRES AT
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(item.expiresAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Offer Price */}
                  <Box
                    display="flex"
                    justifyContent="center"
                    mt={2}
                    p={1}
                    bgcolor="#E3F2FD"
                    borderRadius={1}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      color="primary"
                    >
                      Offer Price: Rs {item.offerPrice}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  {/* <Box display="flex" mt={2}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#F5F5F5", color: "#9E9E9E" }}
                      onClick={() => handleOpenConfirm(item._id)}
                      startIcon={<Delete />}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </Box> */}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && !error && paginatedCategories.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filteredDeals.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      )}

      {/* Confirmation Dialog */}
      {/* <Dialog
        open={openConfirm}
        onClose={isLoading ? undefined : handleCloseConfirm}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this deal? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirm}
            color="primary"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Deleting" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog> */}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default DealOftheDay;
