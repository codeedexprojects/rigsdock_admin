import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { ShoppingCart, Wallet, Settings } from "@mui/icons-material";

const StatCard = ({ icon, title, value, change, changeType }) => {
  return (
    <Card sx={{ width: 250, p: 2, boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Box
            sx={{
              bgcolor:
                changeType === "negative"
                  ? "rgba(255, 99, 99, 0.2)"
                  : "rgba(99, 255, 132, 0.2)",
              borderRadius: "50%",
              p: 1,
              display: "flex",
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        {/* <Box
          component="span"
          sx={{
            fontSize: "0.9rem",
            fontWeight: "bold",
            color: changeType === "negative" ? "red" : "green",
            bgcolor: changeType === "negative" ? "rgba(255, 99, 99, 0.2)" : "rgba(99, 255, 132, 0.2)",
            px: 1,
            py: 0.5,
            borderRadius: 2,
            ml: 1,
          }}
        >
          {change}
        </Box> */}
      </CardContent>
    </Card>
  );
};

const DashboardStats = ({seller}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
        p: 3,
      }}
    >
      <StatCard
        icon={<Wallet sx={{ color: "green" }} />}
        title="Total Balance"
        value={seller.totalBalance}
      />
      <StatCard
        icon={<ShoppingCart sx={{ color: "orange" }} />}
        title="Total Orders"
        value={seller.totalOrders}
       
      />
      <StatCard
        icon={<Settings sx={{ color: "blue" }} />}
        title="Settled amount"
        value={seller.totalSettledAmount}
        
      />
    </Box>
  );
};

export default DashboardStats;
