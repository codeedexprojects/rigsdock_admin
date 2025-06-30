import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import SellerProfile from "../Components/SellerDetails/SellerProfile";
import DashboardStats from "../Components/SellerDetails/StatCard";
import TransactionHistory from "../Components/SellerDetails/Transactions";
import { deleteSelllerApi, getSellerByIdApi } from "../../services/allApi";

const SellerDetails = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [sellerTransaction, setSellerTransaction] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/admin-chat/${sellerId}`);
  };
  const handleSettle = () => {
    toast.success("Amount settled successfully");
  };
  const handleDeleteClick = () => setDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await deleteSelllerApi(sellerId);
      if (response.status === 200) {
        toast.success("Seller deleted successfully");
        navigate("/seller");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete seller");
    } finally {
      setDeleting(false);
      handleCloseDeleteModal();
    }
  };

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await getSellerByIdApi(sellerId);
        console.log("seller-details",response);
       setSellerData(response.data)
       setSellerTransaction(response.data)

        setSeller(response.data.vendor);
      } catch (err) {
        setError("Failed to fetch seller details");
        toast.error("Failed to load seller data");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [sellerId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this seller? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ marginBottom: "4px" }}>
            Seller Details
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Dashboard &gt; Sellers List &gt; Seller Details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2dd0ed",
              color: "#fff",
              "&:hover": { backgroundColor: "#0997b0" },
              padding: "8px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleSettle}
          >
            Settled
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fea116",
              color: "#fff",
              "&:hover": { backgroundColor: "#e89200" },
              padding: "8px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleChatClick}
          >
            Chat
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              padding: "8px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleDeleteClick}
          >
            Delete Seller
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <SellerProfile seller={seller} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <DashboardStats seller={sellerData} />
          <TransactionHistory seller={sellerTransaction} />
        </Grid>
      </Grid>
      <ToastContainer></ToastContainer>
    </Box>
  );
};

export default SellerDetails;
