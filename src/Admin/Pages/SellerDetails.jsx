import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress, Button } from "@mui/material";
import SellerProfile from "../Components/SellerDetails/SellerProfile";
import DashboardStats from "../Components/SellerDetails/StatCard";
import TransactionHistory from "../Components/SellerDetails/Transactions";
import { getSellerByIdApi } from "../../services/allApi";

const SellerDetails = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/admin-chat/${sellerId}`);
  };
  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await getSellerByIdApi(sellerId);
        console.log(response);

        setSeller(response.data);
      } catch (err) {
        setError("Failed to fetch seller details");
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
      {/* Page Title */}
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Seller Details
      </Typography>

      {/* Breadcrumb Navigation */}
      <Typography variant="body2" color="textSecondary">
        Dashboard &gt; Sellers List &gt; Seller Details
      </Typography>

      <Button
    variant="contained"
    sx={{
      backgroundColor: "#fea116",
      color: "#fff",
      '&:hover': {
        backgroundColor: "#e89200"
      },
      padding: "8px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
    }}
    onClick={handleChatClick}
  >
    Chat
  </Button>
      {/* Layout with Grid System */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Left Section: Profile */}
        <Grid item xs={12} sm={4}>
          <SellerProfile seller={seller} />
        </Grid>

        {/* Right Section: Stats & Products */}
        <Grid item xs={12} sm={8}>
          <DashboardStats seller={seller} />
          <TransactionHistory sellerId={sellerId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerDetails;
