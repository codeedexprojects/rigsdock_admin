import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
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
import { Edit, Delete, Add, FilterList } from "@mui/icons-material";
import { getCategoriesApi, deleteCategoryApi } from "../../services/allApi";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
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
    fetchCategories();
  }, []);



  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategoriesApi();
      console.log(response);

      setCategories(response.data.categories);
      setFilteredCategories(response.data.categories);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
    }
    setLoading(false);
  };

  const handleSearch = useCallback(() => {
    if (!search) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(search.toLowerCase()) ||
          category.description.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filtered);
      setPage(1);
    }
  }, [search, categories]); 
  
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleAddCategory = () => {
    navigate("/addcategory");
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
    message: '',
    severity: 'success'
  });

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsLoading(true);
    
    try {
      const response = await deleteCategoryApi(deleteId);
      
      if (response.success) {
        // Update categories lists
        setCategories(categories.filter((item) => item._id !== deleteId));
        setFilteredCategories(
          filteredCategories.filter((category) => category._id !== deleteId)
        );
        
        // Show success notification
        showNotification("Category deleted successfully", "success");
      } else {
        // Show error notification
        showNotification("Failed to delete category. Please try again.", "error");
      }
    } catch (error) {
      // Show error notification with specific error message if available
      showNotification(
        error.message || "Failed to delete category. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
      handleCloseConfirm();
    }
  };

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleEditClick = () => {
    navigate(`/edit-category/${categories._id}`);
  };
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Category List
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Show:</Typography>
          <Select defaultValue="All Products" variant="outlined" size="small">
            <MenuItem value="All Products">All Products</MenuItem>
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
          <IconButton>
            <FilterList />
          </IconButton>
          <Button
            onClick={handleAddCategory}
            variant="contained"
            startIcon={<Add />}
            sx={{ backgroundColor: "#1976D2", color: "white" }}
          >
            New Category
          </Button>
        </Box>
      </Box>
      {/* Search Bar */}
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search by Name, category, Variant etc..."
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
          <Typography>No categories found.</Typography>
        </Box>
      )}
      {!loading && !error && paginatedCategories.length > 0 && (
        <Grid container spacing={3}>
          {paginatedCategories.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" alignItems="center">
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{ width: 100, height: 100, borderRadius: 2, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography color="primary">{item._id}</Typography>
                    <Typography variant="body2" mt={1}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="#9FA3A8"
                      fontWeight={600}
                    >
                      SUB CATEGORY
                    </Typography>
                    <Typography style={{ textAlign: "center" }}>
                      <b>{item.name}</b>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="#9FA3A8"
                      fontWeight={600}
                    >
                      STATUS
                    </Typography>
                    <Typography>
                      <b>{item.status}</b>
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1} mt={2}>
                <Button
              variant="contained"
              sx={{
                backgroundColor: "#E3EDFE",
                color: "#1976D2",
                "&:hover": { backgroundColor: "#D0E2FD" },
              }}
              startIcon={<Edit />}
              fullWidth
              onClick={handleEditClick}
            >
              Edit
            </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#F5F5F5", color: "#9E9E9E" }}
                    onClick={() => handleOpenConfirm(item._id)}
                    startIcon={<Delete />}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {!loading && !error && paginatedCategories.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filteredCategories.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={isLoading ? undefined : handleCloseConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be
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
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? "Deleting" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default CategoryList;
