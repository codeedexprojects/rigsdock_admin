import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Input,
  FormHelperText,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  createMainCategoryApi,
  deleteMainCategoryApi,
  getMainCategoriesApi,
  updateMainCategoryApi,
} from "../../services/allApi";
import {  IMG_BASE_URL } from "../../services/baseUrl";

const MainCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  // Primary color as specified
  const primaryColor = "#1976d2";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getMainCategoriesApi();
      setCategories(response.data.mainCategories);
      setError("");
    } catch (error) {
      setError("Failed to fetch categories. Please try again.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    // Validate inputs
    if (!formData.name || !formData.description) {
      setError("Name and description are required");
      return;
    }

    if (!imageFile && !editingCategory) {
      setImageError("Image is required");
      return;
    }

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingCategory) {
        await updateMainCategoryApi(editingCategory._id, formDataToSend);
      } else {
        await createMainCategoryApi(formDataToSend);
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      setError("Failed to save category. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMainCategoryApi(deleteCategoryId);
      fetchCategories();
      handleDeleteClose();
    } catch (error) {
      setError("Failed to delete category. Please try again.");
    }
  };

  const handleOpen = (category = null) => {
    setEditingCategory(category);
    setFormData(
      category
        ? { name: category.name, description: category.description }
        : { name: "", description: "" }
    );
    setImageFile(null);
    setImagePreview(category?.image ? `${IMG_BASE_URL}/uploads/${category.image}` : "");
    setOpen(true);
    setError("");
    setImageError("");
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setImageFile(null);
    setImagePreview("");
    setError("");
    setImageError("");
  };

  // const handleDeleteOpen = (id) => {
  //   setDeleteCategoryId(id);
  //   setDeleteOpen(true);
  // };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteCategoryId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError("");
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Main Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ 
            backgroundColor: primaryColor,
            '&:hover': {
              backgroundColor: "#1565c0"
            }
          }}
          onClick={() => handleOpen()}
        >
          Add Category
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress sx={{ color: primaryColor }} />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Image</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Description</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell>
                    {category.image && (
                      <Box sx={{ 
                        width: 50, 
                        height: 50, 
                        overflow: 'hidden', 
                        borderRadius: 1,
                        border: `1px solid #e0e0e0`
                      }}>
                        <img 
                          src={`${IMG_BASE_URL}/uploads/${category.image}`}
                          alt={category.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleOpen(category)}
                        sx={{ color: primaryColor }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                     
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Modal 
        open={open} 
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '90vh',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Paper
            sx={{
              borderRadius: 2,
              boxShadow: 24,
              overflowY: 'auto',
              maxHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" id="modal-modal-title" sx={{ color: primaryColor, fontWeight: 500 }}>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </Typography>
              {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: primaryColor,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Description"
                margin="normal"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: primaryColor,
                  },
                }}
              />
              <Box mt={2}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Category Image</Typography>
                <Input
                  type="file"
                  fullWidth
                  onChange={handleImageChange}
                  accept="image/*"
                  sx={{ my: 1 }}
                />
                {imageError && (
                  <FormHelperText error>{imageError}</FormHelperText>
                )}
                {imagePreview && (
                  <Box mt={2} textAlign="center">
                    <Paper elevation={1} sx={{ p: 1, display: 'inline-block' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: 150 }}
                      />
                    </Paper>
                  </Box>
                )}
              </Box>
              <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                <Button 
                  variant="outlined" 
                  onClick={handleClose}
                  sx={{ 
                    borderColor: '#e0e0e0', 
                    color: '#616161',
                    '&:hover': {
                      borderColor: '#bdbdbd',
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ 
                    backgroundColor: primaryColor,
                    '&:hover': {
                      backgroundColor: "#1565c0"
                    }
                  }}
                >
                  {editingCategory ? "Update" : "Save"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Modal>

      {/* Modal for Delete Confirmation - Also made scrollable */}
      <Modal 
        open={deleteOpen} 
        onClose={handleDeleteClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 24,
              textAlign: "center",
              overflowY: 'auto',
              maxHeight: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom id="delete-modal-title" sx={{ color: "#424242" }}>
              Confirm Deletion
            </Typography>
            <Typography sx={{ color: "#616161", mb: 2 }} id="delete-modal-description">
              Are you sure you want to delete this category?
            </Typography>
            <Box mt={2} display="flex" justifyContent="center" gap={1}>
              <Button
                variant="outlined"
                onClick={handleDeleteClose}
                sx={{ 
                  borderColor: '#e0e0e0', 
                  color: '#616161',
                  '&:hover': {
                    borderColor: '#bdbdbd',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleDelete}
                sx={{ 
                  backgroundColor: "#d32f2f",
                  '&:hover': {
                    backgroundColor: "#c62828"
                  }
                }}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </Container>
  );
};

export default MainCategoryManagement;