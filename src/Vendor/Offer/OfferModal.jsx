import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import {
  createVendorOfferApi,
  editVendorOfferApi,
  getvendorproductsApi,
} from "../../services/allApi";
import { toast } from "react-toastify";

function OfferModal({ open, onClose, mode, offer, setOffer }) {
  const isEditMode = mode === "edit";

  const [offerData, setOfferData] = useState({
    name: "",
    description: "",
    discountValue: "",
    discountType: "percentage",
    targetType: "Product",
    target: [],
    validFrom: "",
    validTo: "",
  });
  
  const [errors, setErrors] = useState({});
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update offerData when editing an offer
  useEffect(() => {
    if (mode === "edit" && offer) {
      setOfferData(offer);
    } else {
      setOfferData({
        name: "",
        description: "",
        discountValue: "",
        discountType: "percentage",
        targetType: "Product",
        target: [],
        validFrom: "",
        validTo: "",
      });
    }
  }, [offer, mode]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getvendorproductsApi();
        if (response.status === 200) {
          setProductOptions(response.data.products);
        }
      } catch (error) {
        toast.error("Failed to fetch products.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
    // Clear errors when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleProductChange = (event) => {
    const selectedIds = event.target.value;
    setOfferData({ ...offerData, target: selectedIds });
    // Clear errors when product selection changes
    if (errors.target) {
      setErrors({ ...errors, target: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!offerData.name.trim()) newErrors.name = "Offer name is required";
    if (!offerData.discountValue) newErrors.discountValue = "Discount value is required";
    if (offerData.target.length === 0) newErrors.target = "At least one product must be selected";
    
    // Date validation
    if (offerData.validFrom && offerData.validTo) {
      const fromDate = new Date(offerData.validFrom);
      const toDate = new Date(offerData.validTo);
      if (fromDate >= toDate) {
        newErrors.validTo = "End date must be after start date";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const payload = {
        ...offerData,
        targetType: "Product",
        // Ensure target is always an array
        target: Array.isArray(offerData.target) ? offerData.target : [offerData.target],
      };

      if (isEditMode) {
        const response = await editVendorOfferApi(offerData._id, payload);
        if (response.status === 200) {
          setOffer(response.data.offer || offerData);
          toast.success("Offer updated successfully!");
        }
      } else {
        const response = await createVendorOfferApi(payload);
        if (response.status === 201) {
          toast.success("New offer added successfully!");
        }
      }
      onClose();
    } catch (error) {
      console.error("Error saving offer:", error);
      toast.error(error.response?.data?.message || "Failed to save offer. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">
          {isEditMode ? "Edit Offer" : "Add New Offer"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Offer Name"
            name="name"
            value={offerData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={offerData.description}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Discount Value"
            name="discountValue"
            type="number"
            value={offerData.discountValue}
            onChange={handleChange}
            error={!!errors.discountValue}
            helperText={errors.discountValue}
            sx={{ mb: 2 }}
            required
            InputProps={{
              inputProps: {
                min: 0,
                ...(offerData.discountType === 'percentage' ? { max: 100 } : {})
              }
            }}
          />

          <TextField
            fullWidth
            select
            label="Discount Type"
            name="discountType"
            value={offerData.discountType}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="fixed">Fixed Amount</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Valid From"
            name="validFrom"
            type="datetime-local"
            value={
              offerData.validFrom
                ? new Date(offerData.validFrom).toISOString().substring(0, 16)
                : ""
            }
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Valid To"
            name="validTo"
            type="datetime-local"
            value={
              offerData.validTo
                ? new Date(offerData.validTo).toISOString().substring(0, 16)
                : ""
            }
            onChange={handleChange}
            error={!!errors.validTo}
            helperText={errors.validTo}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            select
            label="Select Products"
            name="target"
            SelectProps={{ multiple: true }}
            value={offerData.target || []}
            onChange={handleProductChange}
            error={!!errors.target}
            sx={{ mb: 1 }}
            required
            disabled={loading}
          >
            {productOptions.length > 0 ? (
              productOptions.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                {loading ? "Loading products..." : "No products available"}
              </MenuItem>
            )}
          </TextField>
          {errors.target && (
            <FormHelperText error>{errors.target}</FormHelperText>
          )}
          {!loading && productOptions.length === 0 && (
            <Typography color="error" variant="caption">
              No products found. Please add products before creating offers.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={loading || productOptions.length === 0}
        >
          {isEditMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OfferModal;