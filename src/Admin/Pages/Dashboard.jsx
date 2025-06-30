import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  CircularProgress,
} from "@mui/material";
import OverView from "../Components/Dashboard/OverView";
import SalesGraph from "../Components/Dashboard/SalesGraph";
import DashboardTables from "../Components/Dashboard/DashboardTables";
import TransactionDashboard from "../Components/Dashboard/TransactionDashboard";
import {
  createPlatformApi,
  getDashboardCustomersApi,
  getDashboardPendingOrdersApi,
  getDashboardSalesApi,
  getDashboardTotalProductsApi,
  getPlatformFeeApi,
} from "../../services/allApi";
import { getMonthlySalesApi } from "../../services/allApi";
import { Button } from "react-bootstrap";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [stats, setStats] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [open, setOpen] = useState(false);
  const [platformFee, setPlatformFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("customer", usersRes);

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
            change: productsRes.success
              ? productsRes.data.percentageChange
              : "0",
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
          console.log("fgg", salesRes.data);
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
  const [feeType] = useState("fixed");
  const [amount, setAmount] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchPlatformFee = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPlatformFeeApi();
      console.log("platform", response);

      if (response.success) {
        setPlatformFee(response.data.amount);
      } else {
        setError(response.error || "Failed to fetch platform fee.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformFee();
  }, []);
  const handleSubmit = async () => {
    const response = await createPlatformApi(feeType, amount);
    if (response.success) {
      console.log("Platform created successfully", response);
      handleClose();
      fetchPlatformFee();
    } else {
      console.error("Error:", response.error);
    }
  };
  return (
    <Box sx={{ px: 3, pt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Overview
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              value={selectedPeriod}
              size="small"
              onChange={(e) => setSelectedPeriod(e.target.value)}
              sx={{
                minWidth: 100,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #ccc",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid primary.main",
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

        {/* Right side: Platform Fee and Create Platform Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : error ? (
            <Typography color="error">
              {typeof error === "object" ? error.message : error}
            </Typography>
          ) : (
            <Typography fontWeight="bold" color="primary">
              Platform Fee: {platformFee}
            </Typography>
          )}
          <Button variant="contained" onClick={handleOpen}>
            Create Platform
          </Button>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Platform</DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              Amount
            </Typography>
            <TextField
              type="number"
              value={amount ?? "N/A"}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
