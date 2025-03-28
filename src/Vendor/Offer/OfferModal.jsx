import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
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

  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getvendorproductsApi();
        if (response.status === 200) {
          setProductOptions(response.data.products);
        }
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (event) => {
    const selectedIds = event.target.value;
    setOfferData({ ...offerData, target: selectedIds });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...offerData,
        targetType: "Product",
      };

      if (isEditMode) {
        const response = await editVendorOfferApi(offerData._id, payload);
        if (response.status === 200) {
          setOffer(offerData);
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
      toast.error("Failed to save offer. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Offer" : "Add New Offer"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Offer Name"
          name="name"
          value={offerData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={offerData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Discount Value"
          name="discountValue"
          type="number"
          value={offerData.discountValue}
          onChange={handleChange}
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          select
          label="Select Products"
          name="target"
          SelectProps={{ multiple: true }}
          value={offerData.target}
          onChange={handleProductChange}
          sx={{ mb: 2 }}
        >
          {productOptions.map((product) => (
            <MenuItem key={product._id} value={product._id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OfferModal;
