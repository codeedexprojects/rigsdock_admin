import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Pagination,
  Snackbar,
} from "@mui/material";
import {  FilterList } from "@mui/icons-material";
import { getvendorCategoriesApi } from "../../services/allApi";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Default");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getvendorCategoriesApi();
      console.log(response);

      setCategories(response.data);
      setFilteredCategories(response.data);
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

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
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
        </Box>
      </Box>
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search by Name, category, Variant etc..."
        sx={{ mb: 3 }}
      />

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
                <Box display="flex" gap={1} mt={2}></Box>
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
export default ViewCategory;
