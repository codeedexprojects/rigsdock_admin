import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem, Typography } from "@mui/material";
import { getVendorDashboardPendingOrdersApi, getVendorDashboardSalesApi, getVendorDashboardTotalProductsApi, getVendorMonthlySalesApi } from "../../services/allApi";
import VendorDashboardOverview from "./VendorDashboardOverview";
import DashboardGraph from "./DashboardGraph";
import VendorDashboardTable from "./VendorDashboardTable";
import VendorDTable from "./VendorDTable";


const VenodorDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [stats, setStats] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching stats for period:", selectedPeriod);

        const [salesRes, productsRes, pendingRes] = await Promise.all(
          [
            getVendorDashboardSalesApi(selectedPeriod),
            getVendorDashboardTotalProductsApi(selectedPeriod),
            getVendorDashboardPendingOrdersApi(selectedPeriod),
          ]
        );
        console.log(salesRes);
        

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
        const salesRes = await getVendorMonthlySalesApi();
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

      <VendorDashboardOverview stats={stats} />

      <Box sx={{ mt: 4 }}>
        <DashboardGraph monthlySales={monthlySales} />
      </Box>

      <Box sx={{ mt: 4 }}>
        <VendorDashboardTable />
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <VendorDTable />
      </Box>
    </Box>
  );
};

export default VenodorDashboard;
