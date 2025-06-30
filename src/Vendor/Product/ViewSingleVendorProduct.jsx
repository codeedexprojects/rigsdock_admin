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
  // FormControlLabel,
  // Switch,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  AddPhotoAlternate as AddImageIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import { useParams, useNavigate } from "react-router-dom";
import {
  deleteVendorProductApi,
  deleteVendorProductAttributeApi,
  deletevendorProductImageApi,
  editVendorProductApi,
  getVendorCategoryByMainCategoryIdApi,
  getVendorMainCategoriesApi,
  getvendorProductByIdApi,
  getVendorSubcategoryByCategoryIdApi,
} from "../../services/allApi";
import { IMG_BASE_URL } from "../../services/baseUrl";
import { toast, ToastContainer } from "react-toastify";

const ViewSingleVendorProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
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
    length: "",
    breadth: "",
    height: "",
    weight: "",
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
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [newAttribute, setNewAttribute] = useState({ key: "", value: "" });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await getvendorProductByIdApi(productId);
        console.log("single-product", response);

        const product = response.data.product;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          finalPrice:product.finalPrice,
          discountprice: product.discountprice || "",
          discountpercentage: product.discountpercentage || "",
          offer: product.offer || false,
          stock: product.stock || "100",
          brand: product.brand || "",
          maincategory: product.maincategory || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          BISCode: product.BISCode || "",
          HSNCode: product.HSNCode || "",
          length: product.length || "",
          breadth: product.breadth || "",
          height: product.height || "",
          weight: product.weight || "",
          deliveryfee: product.deliveryfee || "",
          attributes: product.attributes || {},
        });

        if (product.images && product.images.length > 0) {
          setExistingImages(
            product.images.map((img, index) => ({
              id: `existing-${index}`,
              url: `${IMG_BASE_URL}/uploads/${img}`,
              name: `Image ${index + 1}`,
              size: "Unknown",
            }))
          );
        }

        if (product.maincategory) {
          try {
            const categoryResponse = await getVendorCategoryByMainCategoryIdApi(
              product.maincategory
            );
            setCategories(categoryResponse.data);

            if (product.category) {
              const subcategoryResponse =
                await getVendorSubcategoryByCategoryIdApi(product.category);
              setSubcategories(subcategoryResponse.data);
            }
          } catch (error) {
            console.error("Error loading categories/subcategories:", error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setAlert({
          open: true,
          message: "Failed to fetch product data",
          severity: "error",
        });
        setLoading(false);
      }
    };

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
    fetchProductData();
  }, [productId]);

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

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Maintain file references for FormData
    setImageFiles((prev) => [...prev, ...files]);

    // Create preview objects with proper cleanup
    const newImages = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      preview: URL.createObjectURL(file),
      isNew: true,
      file, // Store the actual File object
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = images[index];

    // Clean up object URLs
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Sync both states using unique identifiers
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (index) => {
    const imageToDelete = existingImages[index];
    if (!imageToDelete?.url) {
      setAlert({
        open: true,
        message: "Image name not found",
        severity: "error",
      });
      return;
    }

    try {
      const response = await deletevendorProductImageApi(
        productId,
        imageToDelete.url
      );

      if (response.success) {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
        setAlert({
          open: true,
          message: "Image deleted successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setAlert({
        open: true,
        message: error.message || "Error deleting image",
        severity: "error",
      });
    }
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

  const handleRemoveAttribute = async (key) => {
    try {
      const response = await deleteVendorProductAttributeApi(productId, key);
      if (response.success) {
        setFormData((prev) => {
          const updatedAttributes = { ...prev.attributes };
          delete updatedAttributes[key];
          return { ...prev, attributes: updatedAttributes };
        });
      } else {
        console.error("Error deleting attribute:", response.error);
      }
    } catch (error) {
      console.error("Error deleting attribute:", error.message);
    }
  };

  const handleAttributeInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
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

  const handleCategoryChange = async (categoryId, maincategoryIdParam) => {
    const mainCategoryToUse = maincategoryIdParam || formData.maincategory;

    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subcategory: "",
    }));
    setSubcategories([]); // Ensure subcategories is always an array

    if (!mainCategoryToUse) {
      console.error("No main category selected");
      setAlert({
        open: true,
        message: "Please select a main category first",
        severity: "error",
      });
      return;
    }

    try {
      const response = await getVendorSubcategoryByCategoryIdApi(
        mainCategoryToUse,
        categoryId
      );

      if (response.data && response.data.length > 0) {
        setSubcategories(response.data);
      } else {
        setSubcategories([]); // Ensure it's an empty array if no subcategories found
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]); // Set empty array in case of error
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

  const handleUpdate = async () => {
    try {
      if (!formData.name || !formData.price || !formData.description) {
        setAlert({
          open: true,
          message: "Please fill in all required fields",
          severity: "error",
        });
        return;
      }

      if (existingImages.length === 0 && imageFiles.length === 0) {
        setAlert({
          open: true,
          message: "At least one product image is required",
          severity: "error",
        });
        return;
      }

      const formDataToSend = new FormData();

      // Add all form fields
      for (const key in formData) {
        if (key !== "attributes") {
          formDataToSend.append(key, formData[key]);
        }
      }

      // Handle attributes
      if (formData.attributes && Object.keys(formData.attributes).length > 0) {
        formDataToSend.append(
          "attributes",
          JSON.stringify(formData.attributes)
        );
      } else {
        formDataToSend.append("attributes", "{}");
      }

      // Try uploading without images first
      const hasImages = imageFiles && imageFiles.length > 0;

      // If we have images and we need to add them
      if (hasImages) {
        // Try using a single field name for all images
        // BUT append as a file array instead of individual files
        const filesArray = Array.from(imageFiles);
        filesArray.forEach((file, index) => {
          // Use the index in the field name to make each unique
          formDataToSend.append(`images[${index}]`, file);
        });
      }

      if (imagesToDelete.length > 0) {
        formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      const response = await editVendorProductApi(productId, formDataToSend);
      console.log("Product updated:", response.data);

      setAlert({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      setAlert({
        open: true,
        message: error.response?.data?.message || "Failed to update product",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/vendor-viewProducts");
  };
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDeleteClick = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteVendorProductApi(productId);
      console.log(response);

      if (response.status === 200) {
        toast.success("Product deleted successfully!");
        setOpenConfirm(false);
        navigate("/vendor-viewProducts");
      } else if (response.status === 404) {
        toast.error("Product not found.");
        setOpenConfirm(false);
      } else {
        toast.error("Something went wrong while deleting the product.");
        setOpenConfirm(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Server error while deleting the product.");
      setOpenConfirm(false);
    }
  };

  const handleAlertClose = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  if (loading) {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Edit Product
        </Typography>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
          sx={{
            backgroundColor: "red",
            color: "white",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          Delete
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Product Images
            </Typography>

            {existingImages.length > 0 && (
              <>
                <Typography variant="subtitle2" mb={1}>
                  Current Images
                </Typography>
                {existingImages.map((image, index) => (
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
                        src={image.url}
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveExistingImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))}
              </>
            )}

            <Typography variant="subtitle2" mt={2} mb={1}>
              Add New Images
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
              <Paper
                key={key}
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
                <Box>
                  <Typography fontSize={14} fontWeight="bold">
                    {key}:
                  </Typography>
                  <Typography variant="body2">{value}</Typography>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveAttribute(key)}
                >
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
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {/* <Button
                variant="contained"
                startIcon={<ImportIcon />}
                sx={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  textTransform: "none",
                }}
              >
                Import
              </Button> */}
            </Box>

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

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="BIS Code"
                  name="BISCode"
                  value={formData.BISCode}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="HSN Code"
                  name="HSNCode"
                  value={formData.HSNCode}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="length"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  variant="outlined"
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
                  required
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
                  onChange={(e) =>
                    handleCategoryChange(e.target.value, formData.maincategory)
                  }
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
                  required
                >
                  {subcategories && subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="N/A" disabled>
                      N/A
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ backgroundColor: "#1565C0", color: "white" }}
                onClick={handleUpdate}
              >
                Update Product
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
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </Box>
  );
};

export default ViewSingleVendorProduct;
