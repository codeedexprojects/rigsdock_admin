import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AddAPhoto as ChangeIcon, Save as SaveIcon } from "@mui/icons-material";
import {
  createCategoryApi,
  getMainCategoriesApi,
} from "../../../services/allApi";

const AddCategoryPage = () => {
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://via.placeholder.com/120"
  );
  const [commissionPercentage,setCommissionPercentage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mainCategories, setMainCategories] = useState([]); // Store main categories
  const [selectedMainCategory, setSelectedMainCategory] = useState(""); // Store selected category

  // 🔹 Fetch main categories on component mount
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getMainCategoriesApi();

        if (response.status === 200) {
          setMainCategories(response.data.mainCategories); // Store category list
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchMainCategories();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCategoryImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      !categoryName.trim() ||
      !categoryImage ||
      !commissionPercentage ||
      !selectedMainCategory
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("commissionPercentage", commissionPercentage);
    formData.append("image", categoryImage, categoryImage.name);
    formData.append("description", description);
    formData.append("maincategory", selectedMainCategory); // ✅ Send ObjectId, not name
    formData.append("status", isActive ? "active" : "inactive");

    try {
      const response = await createCategoryApi(formData);
      if (response.status === 201 || response.status === 200) {
        setSuccess("Category added successfully!");
        setCategoryName("");
        setDescription("");
        setCommissionPercentage("");
        setCategoryImage(null);
        setPreviewImage("https://via.placeholder.com/120");
        setIsActive(false);
        setSelectedMainCategory(""); // Reset dropdown
      } else {
        throw new Error(response.data?.message || "Failed to add category.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Add Category
      </Typography>

      <Card sx={{ borderRadius: 3, p: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="body1" fontWeight="bold" mb={1}>
                UPLOAD CATEGORY IMAGE
              </Typography>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={previewImage}
                  sx={{ width: 120, height: 120, borderRadius: "50%" }}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#FFFFFF",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#F0F0F0" },
                  }}
                >
                  <ChangeIcon sx={{ color: "#5C59E8" }} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold" mb={1}>
                    CATEGORY NAME
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold" mb={1}>
                    COMMISSION PERCENTAGE 
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    required
                    value={commissionPercentage}
                    onChange={(e) => setCommissionPercentage(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold" mb={1}>
                    DESCRIPTION
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                {/* 🔹 MAIN CATEGORY DROPDOWN */}
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold" mb={1}>
                    MAIN CATEGORY
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select Main Category</InputLabel>
                    <Select
                      value={selectedMainCategory}
                      onChange={(e) => setSelectedMainCategory(e.target.value)}
                      label="Select Main Category"
                    >
                      {mainCategories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold" mb={1}>
                    ACTIVE
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                      />
                    }
                    label="Mark Category Active or Not"
                    sx={{ ml: 1, color: "#5C59E8" }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{
                backgroundColor: "#1565C0",
                color: "white",
                textTransform: "none",
              }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddCategoryPage;
