import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem, Typography } from "@mui/material";
import OverView from "../Components/Dashboard/OverView";
import SalesGraph from "../Components/Dashboard/SalesGraph";
import DashboardTables from "../Components/Dashboard/DashboardTables";
import TransactionDashboard from "../Components/Dashboard/TransactionDashboard";
import {
  getDashboardCustomersApi,
  getDashboardPendingOrdersApi,
  getDashboardSalesApi,
  getDashboardTotalProductsApi,
} from "../../services/allApi";
import { getMonthlySalesApi } from "../../services/allApi";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [stats, setStats] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching stats for period:", selectedPeriod);

        const [salesRes, productsRes, usersRes, pendingRes] = await Promise.all(
          [
            getDashboardSalesApi(selectedPeriod),
            getDashboardTotalProductsApi(selectedPeriod),
            getDashboardCustomersApi(selectedPeriod),            
            getDashboardPendingOrdersApi(selectedPeriod),
          ]
          
        );
        console.log("customer",usersRes);

        setStats([
          {
            title: "Total Sales",
            value: salesRes.success ? `₹${salesRes.data.totalSales}` : "0",
            change: salesRes.success ? salesRes.data.percentageChange : "0",
            trend: salesRes.success ? salesRes.data.trend : "",
          },
          {
            title: "Total Products Ordered",
            value: productsRes.success ? productsRes.data.totalProducts : "0",
            change: productsRes.success ? productsRes.data.percentageChange : "0",
            trend: productsRes.success ? productsRes.data.trend : "",
          },
          {
            title: "Total Customers",
            value: usersRes.success ? usersRes.data.totalUsers : "0",
            change: usersRes.success ? usersRes.data.percentageChange : "0",
            trend: usersRes.success ? usersRes.data.trend : "",
          },
          {
            title: "Total Pending Orders",
            value: pendingRes.success ? pendingRes.data.pendingOrders : "0",
            change: pendingRes.success ? pendingRes.data.percentageChange : "0",
            trend: pendingRes.success ? pendingRes.data.trend : "",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    const fetchMonthlySales = async () => {
      try {
        console.log("Fetching monthly sales data...");
        const salesRes = await getMonthlySalesApi();
        console.log(salesRes);
        

        if (salesRes.success) {
          setMonthlySales(salesRes.data);
          console.log("fgg",salesRes.data);
          
        } else {
          setMonthlySales([]);
        }
      } catch (error) {
        console.error("Error fetching monthly sales data:", error);
      }
    };

    fetchStats();
    fetchMonthlySales();
  }, [selectedPeriod]);

  return (
    <Box sx={{ px: 3, pt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 5 }}>
        <Typography variant="h5" fontWeight="bold">
          Overview
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography color="#92929D">Show:</Typography>
          <Select
            value={selectedPeriod}
            size="small"
            onChange={(e) => setSelectedPeriod(e.target.value)}
            sx={{
              minWidth: 80,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="last6Months">Last 6 Months</MenuItem>
            <MenuItem value="thisYear">This Year</MenuItem>
          </Select>
        </Box>
      </Box>

      <OverView stats={stats} />

      <Box sx={{ mt: 4 }}>
        <SalesGraph monthlySales={monthlySales} />
      </Box>

      <Box sx={{ mt: 4 }}>
        <DashboardTables />
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <TransactionDashboard />
      </Box>
    </Box>
  );
};

export default Dashboard;
