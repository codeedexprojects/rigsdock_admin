import React, { useState, useEffect } from "react";
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
  Avatar,
  Chip,
  CircularProgress,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Snackbar,
  Alert,
  Stack,
  Pagination,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getproductsApi, deleteProductApi, bulkDeleteVendorProductsApi } from "../../../services/allApi";
import { BASE_URL } from "../../../services/baseUrl";
// import { useNavigate } from "react-router-dom";
// import AddIcon from "@mui/icons-material/Add";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const navigate = useNavigate();

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
    if (selectedProductIds.length === 0) {
      alert("No products selected for deletion");
      return;
    }
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setAction("");
  };
  const handleDeleteProduct = async () => {
    if (!selectedProductIds.length) return;
  
    setIsDeleting(true);
    try {
      const response = await bulkDeleteVendorProductsApi(selectedProductIds);
  
      if (response.success) {
        setProducts((prev) =>
          prev.filter((p) => !selectedProductIds.includes(p._id))
        );
        setSelectedProductIds([]);
        setSnackbar({
          open: true,
          message: `${selectedProductIds.length} product${
            selectedProductIds.length > 1 ? "s" : ""
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
  

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getproductsApi();
        console.log(response);

        if (response.success && response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          setError("Failed to fetch products data");
        }
      } catch (error) {
        setError("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle select all
  const handleSelectAll = (event) => {
    const newSelected = event.target.checked
      ? filteredProducts.map((p) => p._id)
      : [];
    setSelectedProductIds(newSelected);
  };
  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectProduct = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
  const timeFilteredProducts = filteredProducts.filter((product) => {
    if (timeFilter === "all") return true;

    const productDate = new Date(product.createdAt);
    const now = new Date();

    if (timeFilter === "week") {
      // Check if product was created within the last week
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return productDate >= weekAgo;
    } else if (timeFilter === "month") {
      // Check if product was created within the last month
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return productDate >= monthAgo;
    }

    return true;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...timeFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return parseFloat(a.price) - parseFloat(b.price);
      case "date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0; // Default sorting (as returned from API)
    }
  });

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
            Products
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setPage(1); // Reset to first page when filter changes
              }}
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
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography color="#92929D">Sort by:</Typography>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
          <IconButton>
            <FilterAltOutlinedIcon sx={{ color: "#9FA3A8" }} />
          </IconButton>
          {/* <Link to="/addProduct" style={{ textDecoration: "none" }}>
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
              Add Product
            </Button>
          </Link> */}
        </Box>
      </Box>
      <Paper
        elevation={0}
        sx={{ mb: 4, display: "flex", alignItems: "center", p: 1, gap: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Search by product name, brand, or category"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            value={action} // Controlled value
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
      {/* Loading State */}
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
      {/* Table */}
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
                      selectedProductIds.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    indeterminate={
                      selectedProductIds.length > 0 &&
                      selectedProductIds.length < filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    disabled={filteredProducts.length === 0}
                  />
                </TableCell>
                <TableCell>
                  <strong>All Products List</strong>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "#212B36",
                    fontWeight: "bold",
                  }}
                >
                  CATEGORY
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "#212B36",
                    fontWeight: "bold",
                  }}
                >
                  BRAND
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "#212B36",
                    fontWeight: "bold",
                  }}
                >
                  STOCK
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
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    sx={{
                      backgroundColor: selectedProductIds.includes(product._id)
                        ? "#f5f5f5"
                        : "inherit",
                      "&:hover": {
                        backgroundColor: "#fafafa",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                    // onClick={() => navigate(`/products/edit/${product._id}`)} 
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedProductIds.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        inputProps={{ "aria-label": `Select ${product.name}` }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={
                            product.images && product.images.length > 0
                              ? `${BASE_URL}/uploads/${product.images[0]}`
                              : ""
                          }
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        />
                        <Box>
                          <Typography fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: 200,
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {product.category?.name || "N/A"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {product.brand || "N/A"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={
                          product.stock > 0
                            ? `In Stock (${product.stock})`
                            : "Out of Stock"
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            product.stock > 0 ? "#DFEFDC" : "#EB57571A",
                          color: product.stock > 0 ? "#219653" : "#EB5757",
                          fontWeight: "medium",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#0A5FBF",
                        textAlign: "center",
                        fontWeight: "medium",
                      }}
                    >
                      {product.price}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>
          Delete {selectedProductIds.length} Product
          {selectedProductIds.length > 1 ? "s" : ""}?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {selectedProductIds.length > 1
              ? `Are you sure you want to delete these ${selectedProductIds.length} products? This action cannot be undone.`
              : "Are you sure you want to delete this product? This action cannot be undone."}
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
      {!loading && !error && sortedProducts.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            px: 2,
          }}
        >
          <Typography color="text.secondary">
            Showing{" "}
            {Math.min(sortedProducts.length, (page - 1) * rowsPerPage + 1)}-
            {Math.min(sortedProducts.length, page * rowsPerPage)} of{" "}
            {sortedProducts.length} products
          </Typography>

          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Stack>

          <Box sx={{ minWidth: 120 }}>
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
                setPage(1); // Reset to first page when rows per page changes
              }}
              size="small"
              sx={{ ml: 2 }}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
              <MenuItem value={50}>50 per page</MenuItem>
            </Select>
          </Box>
        </Box>
      )}{" "}
    </Box>
  );
};

export default ViewProducts;
