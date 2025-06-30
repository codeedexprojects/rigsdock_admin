import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Edit, Delete, Add, FilterList } from "@mui/icons-material";
import {
  deleteSubCategoryApi,
  getSubCategoriesApi,
} from "../../services/allApi";
import AddEditSubCategoryModal from "../Components/subcategory/AddEditSubCategoryModal";
import {  IMG_BASE_URL } from "../../services/baseUrl";
import { toast, ToastContainer } from "react-toastify";

const CategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("Default");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleOpenModal = (subCategory = null) => {
    setSelectedSubCategory(subCategory);
    setOpenModal(true);
  };

  
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getSubCategoriesApi(page);
        console.log("subcategories", response);

        if (response.success) {
          setSubCategories(response.data.subCategories);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setError("Failed to load subcategories.");
        }
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [page]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const handleDeleteClick = (subcategory) => {
    setSelectedSubCategory(subcategory);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubCategory) {
      console.log("No subcategory selected for deletion.");
      toast.warn("No subcategory selected.");
      return;
    }
  
    console.log("Attempting to delete subcategory:", selectedSubCategory);
  
    try {
      const response = await deleteSubCategoryApi(selectedSubCategory._id);
      console.log("Delete API Response:", response);
  
      if (response.message === "SubCategory deleted successfully") {
        toast.success(response.message);
    
  
        const updatedSubCategories = subCategories.filter(
          (item) => item._id !== selectedSubCategory._id
        );
        setSubCategories(updatedSubCategories);
  
        // If no items left and page > 1, go back a page
        if (updatedSubCategories.length === 0 && page > 1) {
          setPage(page - 1);
        }
      } else {
        console.warn("Deletion failed:", response.error || "Unknown error");
        toast.error(response.error || "Failed to delete subcategory.");
      }
    } catch (err) {
      console.error("Error while deleting subcategory:", err);
      toast.error("Error while deleting subcategory. Please try again.");
    } finally {
      console.log("Closing delete modal.");
      setDeleteModalOpen(false);
      setSelectedSubCategory(null); // Reset selection
    }
  };
  
  const filteredSubCategories = subCategories
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.variants &&
          item.variants.some((v) =>
            v.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    )
    .sort((a, b) => (sort === "Name" ? a.name.localeCompare(b.name) : 0));

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
          Sub Category List
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
            onClick={() => handleOpenModal(null)}
            variant="contained"
            startIcon={<Add />}
            sx={{ backgroundColor: "#1976D2", color: "white" }}
          >
            New Sub Category
          </Button>
        </Box>
      </Box>
      {/* Search Bar */}
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Error State */}
      {error && (
        <Box mt={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && filteredSubCategories.length > 0 && (
        <Grid container spacing={3}>
          {filteredSubCategories.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" alignItems="center">
                  <CardMedia
                    component="img"
                    image={`${IMG_BASE_URL}/uploads/${item.image}`}
                    alt={item.name}
                    sx={{ width: 100, height: 100, borderRadius: 2, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography color="primary">{item._id}</Typography>
                    <Typography variant="body2" mt={1}>
                      {typeof item.description === "string"
                        ? item.description
                        : JSON.stringify(item.description)}
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
                      CATEGORY
                    </Typography>
                    <Typography style={{ textAlign: "center" }}>
                      <b>{item.category?.name || "N/A"}</b>
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
                    onClick={() => handleOpenModal(item)}
                    variant="contained"
                    sx={{
                      backgroundColor: "#E3EDFE",
                      color: "#1976D2",
                      "&:hover": { backgroundColor: "#D0E2FD" },
                    }}
                    startIcon={<Edit />}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(item)}
                    variant="contained"
                    sx={{ backgroundColor: "#F5F5F5", color: "#9E9E9E" }}
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
      {!loading && !error && subCategories.length === 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography>No subcategories found.</Typography>
        </Box>
      )}
      {!loading && !error && subCategories.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      )}
      <AddEditSubCategoryModal
        open={openModal}
        handleClose={handleCloseModal}
        subCategory={selectedSubCategory}
        onSuccess={() => window.location.reload()}
      />
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the subcategory "
            <strong>{selectedSubCategory?.name}</strong>"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </Box>
  );
};
export default CategoryList;
