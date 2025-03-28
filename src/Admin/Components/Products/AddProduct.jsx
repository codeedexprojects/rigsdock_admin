import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  IconButton,
  Grid,
  Paper,
  MenuItem,
  FormControlLabel,
  Switch,
  // Chip,
  // Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AddPhotoAlternate as AddImageIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Upload as ImportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  createProductApi,
  getCategoryByMainCategoryIdApi,
  getMainCategoriesApi,
  getSubcategoryByMainCategoryAndCategoryIdApi,
} from "../../../services/allApi";

const AddProductPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountprice: "",
    discountpercentage: "",
    offer: false,
    stock: "100", // Default stock value
    brand: "",
    maincategory: "",
    category: "",
    subcategory: "",
    tags: [],
    attributes: {},
  });

  // State for alert messages
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for image handling
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // State for categories
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // State for attribute inputs
  const [newAttribute, setNewAttribute] = useState({ key: "", value: "" });
  // const [productTags, setProductTags] = useState([
  //   "Electronics",
  //   "Accessories",
  //   "Gadgets",
  //   "Audio",
  //   "Wireless",
  // ]);
  // const [selectedTags, setSelectedTags] = useState([]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate discount price or percentage when price changes
    if (name === "price" && formData.offer) {
      if (formData.discountpercentage) {
        const discountPrice =
          (value * (100 - formData.discountpercentage)) / 100;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          discountprice: discountPrice.toFixed(2),
        }));
      }
    }

    // Calculate discount percentage when discount price changes
    if (name === "discountprice" && formData.offer && formData.price) {
      const percentage = ((formData.price - value) / formData.price) * 100;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        discountpercentage: percentage.toFixed(2),
      }));
    }

    // Calculate discount price when discount percentage changes
    if (name === "discountpercentage" && formData.offer && formData.price) {
      const discountPrice = (formData.price * (100 - value)) / 100;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        discountprice: discountPrice.toFixed(2),
      }));
    }
  };

  // Handle offer toggle
  const handleOfferToggle = (e) => {
    setFormData((prev) => ({
      ...prev,
      offer: e.target.checked,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Ensure files are added as File objects for API submission
    setImageFiles((prev) => [...prev, ...files]);

    // Create preview images for UI display
    const newImages = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  // Handle tags
  // const handleTagToggle = (tag) => {
  //   if (selectedTags.includes(tag)) {
  //     setSelectedTags(selectedTags.filter((t) => t !== tag));
  //   } else {
  //     setSelectedTags([...selectedTags, tag]);
  //   }
  // };

  // Handle attribute addition
  const handleAddAttribute = () => {
    if (newAttribute.key && newAttribute.value) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes, // Directly use prev.attributes (assumed to be an object)
          [newAttribute.key]: newAttribute.value,
        },
      }));
      setNewAttribute({ key: "", value: "" });
    }
  };
  
  const handleRemoveAttribute = (key) => {
    setFormData((prev) => {
      const updatedAttributes = { ...prev.attributes };
      delete updatedAttributes[key];
      return {
        ...prev,
        attributes: updatedAttributes,
      };
    });
  };

  // Handle attribute input change
  const handleAttributeInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch Main Categories on Component Mount
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getMainCategoriesApi();
        setMainCategories(response.data.mainCategories);
      } catch (error) {
        console.error("Error fetching main categories:", error);
        setAlert({
          open: true,
          message: "Failed to fetch main categories",
          severity: "error",
        });
      }
    };
    fetchMainCategories();
  }, []);

  // Fetch Categories when Main Category is Selected
  const handleMainCategoryChange = async (mainCategoryId) => {
    setFormData((prev) => ({
      ...prev,
      maincategory: mainCategoryId,
      category: "",
      subcategory: "",
    }));
    setCategories([]);
    setSubcategories([]);

    try {
      const response = await getCategoryByMainCategoryIdApi(mainCategoryId);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setAlert({
        open: true,
        message: "Failed to fetch categories",
        severity: "error",
      });
    }
  };

  // Fetch Subcategories when Category is Selected
  const handleCategoryChange = async (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subcategory: "",
    }));
    setSubcategories([]);

    try {
      const response = await getSubcategoryByMainCategoryAndCategoryIdApi(
        formData.maincategory,
        categoryId
      );
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setAlert({
        open: true,
        message: "Failed to fetch subcategories",
        severity: "error",
      });
    }
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId) => {
    setFormData((prev) => ({
      ...prev,
      subcategory: subcategoryId,
    }));
  };

  // Handle product submission
  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.price || !formData.description) {
        setAlert({
          open: true,
          message: "Please fill in all required fields",
          severity: "error",
        });
        return;
      }
  
      if (imageFiles.length === 0) {
        setAlert({
          open: true,
          message: "At least one product image is required",
          severity: "error",
        });
        return;
      }
  
      // Debug - check attributes before form submission
      console.log("Attributes before submission:", formData.attributes);
  
      const formDataToSend = new FormData();
  
      // Add all fields except attributes and tags
      for (const key in formData) {
        if (key !== "attributes" && key !== "tags") {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      // Handle tags
      formDataToSend.append("tags", JSON.stringify(formData.tags || []));
  
      // Handle attributes - ensure it's a proper object
   // Handle attributes - ensure it's a proper object
let attributesToSend = {};

if (
  typeof formData.attributes === 'object' && 
  formData.attributes !== null && 
  !Array.isArray(formData.attributes)
) {
  attributesToSend = formData.attributes;
} else if (typeof formData.attributes === 'string') {
  try {
    attributesToSend = JSON.parse(formData.attributes);
  } catch (e) {
    console.error("Failed to parse attributes string:", e);
    attributesToSend = {};
  }
}

// Append the PROPERLY parsed attributes
formDataToSend.append("attributes", JSON.stringify(attributesToSend));
      
      // Important: stringify the object, not a string
// Inside handleSubmit
// ✅ Use the parsed attributesToSend instead
formDataToSend.append("attributes", JSON.stringify(attributesToSend));  
      // Add images
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });
  
      const response = await createProductApi(formDataToSend);
      console.log("Product created:", response.data);
  
      setAlert({
        open: true,
        message: "Product created successfully!",
        severity: "success",
      });
  
      // Reset form with proper empty objects
      setFormData({
        name: "",
        description: "",
        price: "",
        discountprice: "",
        discountpercentage: "",
        offer: false,
        stock: "100",
        brand: "",
        maincategory: "",
        category: "",
        subcategory: "",
        tags: [],
        attributes: {}, // Reset as an empty object
      });
      setImages([]);
      setImageFiles([]);
    } catch (error) {
      console.error("Error creating product:", error);
      setAlert({
        open: true,
        message: error.response?.data?.message || "Failed to create product",
        severity: "error",
      });
    }
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Add Products
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side: Image Upload Section */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Add images
            </Typography>
            {/* Image Upload Box */}
            <Paper
              elevation={0}
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                backgroundColor: "#F8F9FB",
              }}
            >
              <AddImageIcon sx={{ fontSize: 50, color: "#5C59E8" }} />
              <Typography variant="body2" color="text.secondary">
                Drag and drop image here, or click add image
              </Typography>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, backgroundColor: "#E3E8FF", color: "#5C59E8" }}
              >
                Add Image
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Button>
            </Paper>

            {/* Uploaded Images List */}
            {images.map((image, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  mt: 2,
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={image.preview}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                  <Box>
                    <Typography fontSize={14}>{image.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {image.size}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}

            {/* Attributes Section */}
            <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
              Product Attributes
            </Typography>

            {/* Attributes List */}
            {Object.entries(formData.attributes).map(([key, value]) => (
  <Paper key={key}>
    <Typography>{key}: {value}</Typography>
    <IconButton onClick={() => handleRemoveAttribute(key)}>
      <DeleteIcon />
    </IconButton>
  </Paper>
))}

            {/* Add New Attribute Form */}
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Attribute Name"
                name="key"
                value={newAttribute.key}
                onChange={handleAttributeInputChange}
                placeholder="e.g., Bluetooth version"
                size="small"
              />
              <TextField
                fullWidth
                label="Attribute Value"
                name="value"
                value={newAttribute.value}
                onChange={handleAttributeInputChange}
                placeholder="e.g., 5.3"
                size="small"
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddAttribute}
                disabled={!newAttribute.key || !newAttribute.value}
              >
                Add Attribute
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Right Side: Product Details Form */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            {/* Import Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<ImportIcon />}
                sx={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  textTransform: "none",
                }}
              >
                Import
              </Button>
            </Box>

            <Grid container spacing={2} mt={2}>
              {/* Product Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Base Price and Offer Toggle */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Base Price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  variant="outlined"
                  type="number"
                  required
                />
              </Grid>

              {/* Offer Toggle */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.offer}
                      onChange={handleOfferToggle}
                      name="offer"
                      color="primary"
                    />
                  }
                  label="Special Offer"
                />
              </Grid>

              {/* Discount Fields - Only shown when offer is true */}
              {formData.offer && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Discount Percentage (%)"
                      name="discountpercentage"
                      value={formData.discountpercentage}
                      onChange={handleInputChange}
                      variant="outlined"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Offer Price"
                      name="discountprice"
                      value={formData.discountprice}
                      onChange={handleInputChange}
                      variant="outlined"
                      type="number"
                    />
                  </Grid>
                </>
              )}

              {/* Stock */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  variant="outlined"
                  type="number"
                />
              </Grid>

              {/* Brand */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              {/* Main Category */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Main Category"
                  value={formData.maincategory}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  variant="outlined"
                  required
                >
                  {mainCategories.map((main) => (
                    <MenuItem key={main._id} value={main._id}>
                      {main.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Category */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  variant="outlined"
                  disabled={!formData.maincategory}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Subcategory */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Subcategory"
                  value={formData.subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  variant="outlined"
                  disabled={!formData.category}
                >
                  {subcategories.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Product Tags */}
              {/* <Grid item xs={12}>
                <Typography variant="subtitle1" mb={1}>
                  Product Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {productTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      clickable
                      color={selectedTags.includes(tag) ? "primary" : "default"}
                      onClick={() => handleTagToggle(tag)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid> */}
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ backgroundColor: "#1565C0", color: "white" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Notification */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProductPage;
