import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from "@mui/material";
import { useState } from "react";
import { updateSellerRequestApi } from "../../services/allApi";

const SellerDetailsModal = ({ open, handleClose, seller, onStatusUpdate }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  if (!seller) return null;
  
  // Set the initial status when the component mounts or when seller changes
  if (status === "" && seller?.status) {
    setStatus(seller.status);
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!seller) return;
    
    setLoading(true);
    try {
      const response = await updateSellerRequestApi(seller._id, { status });
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: "Status updated successfully",
          severity: "success"
        });
        
        // Call the callback to update the parent component's state
        if (onStatusUpdate) {
          onStatusUpdate(seller._id, status);
        }
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update status",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while updating status",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Seller Details</DialogTitle>
        <DialogContent>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {seller.businessname}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Owner Name:
                </Typography>
                <Typography variant="body2">{seller.ownername}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Email:
                </Typography>
                <Typography variant="body2">{seller.email}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Phone:
                </Typography>
                <Typography variant="body2">{seller.number}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Store Type:
                </Typography>
                <Typography variant="body2">{seller.storetype}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  City:
                </Typography>
                <Typography variant="body2">{seller.city}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  State:
                </Typography>
                <Typography variant="body2">{seller.state}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Pincode:
                </Typography>
                <Typography variant="body2">{seller.pincode}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" fontWeight="bold">
                  Description:
                </Typography>
                <Typography variant="body2">{seller.description}</Typography>
              </Grid>

              {/* Status update section */}
              <Grid item xs={12}>
                <Box mt={2} mb={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      value={status}
                      onChange={handleStatusChange}
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleUpdateStatus} 
              disabled={loading || status === seller.status}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SellerDetailsModal;