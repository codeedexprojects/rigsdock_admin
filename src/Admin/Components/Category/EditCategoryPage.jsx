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
  getMainCategoriesApi,
  getCategoryByIdApi,
  updateCategoryApi,
} from "../../../services/allApi";
import { useParams, useNavigate } from "react-router-dom";
import {  IMG_BASE_URL } from "../../../services/baseUrl";

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://via.placeholder.com/120"
  );
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [commissionPercentage,setCommissionPercentage] = useState("");

  // Fetch category details and main categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        // Fetch current category data
        const categoryResponse = await getCategoryByIdApi(id);
        // console.log(categoryResponse);
        
        if (categoryResponse.status === 200) {
          const categoryData = categoryResponse.data;
          setCategoryName(categoryData.name);
          setCommissionPercentage(categoryData.commissionPercentage);
          setDescription(categoryData.description);
          setIsActive(categoryData.status === "active");
          setSelectedMainCategory(
            categoryData.maincategory._id || categoryData.maincategory
          );
          setPreviewImage(
            categoryData.image ? `${IMG_BASE_URL}/uploads/${categoryData.image}` : "https://via.placeholder.com/120"
          );
          
        } else {
          throw new Error("Failed to fetch category details");
        }

        // Fetch main categories
        const mainCategoriesResponse = await getMainCategoriesApi();
        if (mainCategoriesResponse.status === 200) {
          setMainCategories(mainCategoriesResponse.data.mainCategories);
        } else {
          throw new Error("Failed to fetch main categories");
        }
      } catch (error) {
        setError(error.message || "Something went wrong while fetching data");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCategoryImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setImageChanged(true);
    }
  };

  const handleSubmit = async () => {
    if (!categoryName.trim() || !description.trim() || !selectedMainCategory) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("commissionPercentage", commissionPercentage);
    formData.append("description", description);
    formData.append("maincategory", selectedMainCategory);
    formData.append("status", isActive ? "active" : "inactive");

    if (imageChanged && categoryImage) {
      formData.append("image", categoryImage, categoryImage.name);
    }
    console.log("Form data being sent:", {
      name: categoryName,
      description, 
      maincategory: selectedMainCategory,
      status: isActive ? "active" : "inactive",
      imageChanged
    });
    try {
      const response = await updateCategoryApi(id, formData);
      console.log(response);
      
      if (response.status === 200) {
        setSuccess("Category updated successfully!");
        setTimeout(() => navigate("/viewCategory"), 2000);
      } else {
        throw new Error(response.data?.message || "Failed to update category.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Edit Category
      </Typography>

      <Card sx={{ borderRadius: 3, p: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="body1" fontWeight="bold" mb={1}>
                CATEGORY IMAGE
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
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
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
              variant="outlined"
              sx={{
                mr: 2,
                textTransform: "none",
              }}
              disabled={loading}
              onClick={() => navigate("/admin/categories")}
            >
              Cancel
            </Button>
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
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditCategoryPage;
