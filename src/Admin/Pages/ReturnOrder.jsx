import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, CircularProgress, Typography } from "@mui/material";
import { getOrderByIdApi } from "../../services/allApi";
import ReturnOrderDetailsSection from "../Components/OrderDetails/ReturnOrderDetailsSection";
import ReturnOrderList from "../Components/OrderDetails/ReturnOrderList";
import ReturnOrderInfo from "../Components/OrderDetails/ReturnOrderInfo";

function ReturnOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderByIdApi(id);
        console.log("Order Data:", response.data);

        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {order ? (
        <>
          <Box sx={{ mb: 3 }}>
            <ReturnOrderDetailsSection order={order} />
          </Box>

          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} md={8}>
              <ReturnOrderList order={order} />
            </Grid>

            <Grid item xs={12} md={4}>
              <ReturnOrderInfo order={order} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="h6" color="textSecondary" textAlign="center">
          No order details available.
        </Typography>
      )}
    </Box>
  );
}

export default ReturnOrder;
