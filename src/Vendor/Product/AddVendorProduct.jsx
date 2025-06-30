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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AddPhotoAlternate as AddImageIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  // Upload as ImportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  createvendorProductApi,
  getVendorCategoryByMainCategoryIdApi,
  getVendorMainCategoriesApi,
  getVendorSubcategoryByCategoryIdApi,
} from "../../services/allApi";

const AddVendorProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    finalPrice:"",
    discountprice: "",
    discountpercentage: "",
    offer: false,
    stock: "",
    brand: "",
    maincategory: "",
    category: "",
    subcategory: "",
    BISCode: "",
    HSNCode: "",
    length:"",
    breadth:"",
    height:"",
    weight:"",
    deliveryfee:"",
    attributes: {},
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [newAttribute, setNewAttribute] = useState({ key: "", value: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    if (name === "discountprice" && formData.offer && formData.price) {
      const percentage = ((formData.price - value) / formData.price) * 100;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        discountpercentage: percentage.toFixed(2),
      }));
    }

    if (name === "discountpercentage" && formData.offer && formData.price) {
      const discountPrice = (formData.price * (100 - value)) / 100;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        discountprice: discountPrice.toFixed(2),
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    const newImages = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getVendorMainCategoriesApi();

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
      const response = await getVendorCategoryByMainCategoryIdApi(
        mainCategoryId
      );
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

  const handleCategoryChange = async (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subcategory: "",
    }));
    setSubcategories([]);

    try {
      const response = await getVendorSubcategoryByCategoryIdApi(categoryId);
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

  const handleSubcategoryChange = (subcategoryId) => {
    setFormData((prev) => ({
      ...prev,
      subcategory: subcategoryId,
    }));
  };
  const handleAddAttribute = () => {
    if (newAttribute.key && newAttribute.value) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
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

  const handleAttributeInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      if (!formData.name  || !formData.description) {
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

      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key !== "attributes") {
          formDataToSend.append(key, formData[key]);
        }
      }

      if (formData.attributes && Object.keys(formData.attributes).length > 0) {
        // Correctly structure the attributes for FormData
        Object.entries(formData.attributes).forEach(([key, value]) => {
          formDataToSend.append(`attributes[${key}]`, value);
        });
      } else {
        formDataToSend.append("attributes", "{}");
      }

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      console.log("Form data entries:");
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
        if (pair[0].startsWith("attributes")) {
          console.log(`Attributes value type: ${typeof pair[1]}`);
          console.log(`Raw attributes value: ${pair[1]}`);
        }
      }

      const response = await createvendorProductApi(formDataToSend);

      if (response.status >= 200 && response.status < 300) {
        console.log("Product created:", response.data);

        setAlert({
          open: true,
          message: "Product created successfully!",
          severity: "success",
        });

        setFormData({
          name: "",
          description: "",
          price: "",
          finalPrice:"",
          discountprice: "",
          discountpercentage: "",
          offer: false,
          stock: "100",
          brand: "",
          maincategory: "",
          category: "",
          subcategory: "",
          BISCode: "",
          HSNCode: "",
          length:"",
          breadth:"",
          height:"",
          deliveryfee:"",
          weight:"",
          attributes: {},
        });
        setImages([]);
        setImageFiles([]);
      } else {
        throw new Error(response.data?.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);

      setAlert({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create product",
        severity: "error",
      });
    }
  };

  const handleAlertClose = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Add Products
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Add images
            </Typography>
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

            <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
              Product Attributes
            </Typography>

            {Object.entries(formData.attributes).map(([key, value]) => (
              <Paper key={key}>
                <Typography>
                  {key}: {value}
                </Typography>
                <IconButton onClick={() => handleRemoveAttribute(key)}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}

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

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
            </Box> */}

            <Grid container spacing={2} mt={2}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Final Price"
                  name="finalPrice"
                  value={formData.finalPrice}
                  onChange={handleInputChange}
                  variant="outlined"
                  type="number"
                  required
                />
              </Grid>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="BIS Code"
                  name="BISCode"
                  value={formData.BISCode}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="HSN Code"
                  name="HSNCode"
                  value={formData.HSNCode}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="length"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
             
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="breadth"
                  name="breadth"
                  value={formData.breadth}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Fee"
                  name="deliveryfee"
                  value={formData.deliveryfee}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </Grid>

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

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Subcategory"
                  value={formData.subcategory || ""}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  variant="outlined"
                  disabled={!formData.category}
                >
                  {subcategories?.length === 0 ? (
                    <MenuItem value="" disabled>
                      N/A
                    </MenuItem>
                  ) : (
                    subcategories?.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>
            </Grid>

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

export default AddVendorProduct;
