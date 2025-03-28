import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  createSubCategoryApi,
  getCategoriesApi,
  updateSubCategoryApi,
} from "../../../services/allApi";

const AddEditSubCategoryModal = ({
  open,
  handleClose,
  subCategory,
  onSuccess,
}) => {
  const isEditing = !!subCategory; // If subCategory exists, it's Edit Mode
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesApi();
        if (response.success) {
          setCategories(response.data.categories);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Error fetching categories");
      }
    };

    if (open) {
      fetchCategories();

      if (isEditing) {
        setName(subCategory.name || "");
        setDescription(subCategory.description || "");

        // Ensure category is set to its _id (Extracting ID properly)
        setCategory(subCategory.category?._id || "");
        setStatus(subCategory.status ?? true); // Preserve status if editing, default to true
      } else {
        setName("");
        setDescription("");
        setCategory("");
        setStatus(true);
      }
    }
  }, [open, subCategory, isEditing]);

  // Handle Submit (Add or Edit)
  const handleSubmit = async () => {
    if (!name || !description || !category) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name,
        description,
        category,
        status,
      };

      let response;
      if (isEditing) {
        response = await updateSubCategoryApi(subCategory._id, payload);
      } else {
        response = await createSubCategoryApi(payload);
      }

      if (response.success) {
        onSuccess(); // Refresh Data
        handleClose();
      } else {
        setError("Failed to save sub-category");
      }
    } catch (err) {
      setError("Error saving sub-category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 3,
          width: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          {isEditing ? "Edit Sub Category" : "Add Sub Category"}
        </Typography>

        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Select
          fullWidth
          displayEmpty
          value={category} // Ensure this holds the category _id
          onChange={(e) => setCategory(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>
            Select Category
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value === "true")}
          sx={{ mb: 2 }}
        >
          <MenuItem value={true}>Active</MenuItem>
          <MenuItem value={false}>Inactive</MenuItem>
        </Select>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditing ? (
            "Update"
          ) : (
            "Add"
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddEditSubCategoryModal;
