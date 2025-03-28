import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { TrendingUp, TrendingDown, ShoppingCart, PendingActions } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StatsCard = styled(Card)({
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  height: 171.2312774658203,
  width: 272.41339111328125,
  padding: "2px 2px",
});

const iconStyles = {
  TotalSales: <ShoppingCart sx={{ color: "#2196f3" }} />,
  TotalProductsOrdered: <ShoppingCart sx={{ color: "#f44336" }} />,
  TotalPendingOrders: <PendingActions sx={{ color: "#9c27b0" }} />,
};

const VendorDashboardOverview = ({ stats }) => {
  return (
    <Box sx={{ p: 1, width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 3,
        }}
      >
        {stats.map((stat, index) => (
          <StatsCard key={index}>
            <CardContent sx={{ padding: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                {iconStyles[stat.title.replace(/\s+/g, "")]}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: stat.trend === "up" ? "success.main" : "error.main",
                  }}
                >
                  {stat.trend === "up" ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {stat.change}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, fontSize: 32 }}>
                {stat.value}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {stat.title}
              </Typography>
            </CardContent>
          </StatsCard>
        ))}
      </Box>
    </Box>
  );
};

export default VendorDashboardOverview;
