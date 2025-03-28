import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  IconButton,
  FormControl,
  InputAdornment,
  Paper,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { getvendornotificationApi } from "../../services/allApi";
import VendorNotification from "./VendorNotification";
import Vendornotificationpagination from "./Vendornotificationpagination";

const NotificationVendor = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await getvendornotificationApi();
        console.log(response);

        if (response.status === 200) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
      } finally {
      }
    };

    fetchNotification();
  }, []);

  const filteredNotification = useMemo(() => {
    let data = [...notifications];

    if (searchQuery) {
      data = data.filter((notification) =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.title.localeCompare(b.ownername));
    } else if (sortBy === "age") {
      data.sort((a, b) => a.age - b.age);
    }

    // Apply Filter
    if (filterBy !== "all") {
      data = data.filter((seller) => seller.createdAt === filterBy);
    }

    return data;
  }, [notifications, searchQuery, sortBy, filterBy]);

  const paginatedSellers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotification.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotification, currentPage, itemsPerPage]);

  return (
    <Box sx={{ paddingX: 5, paddingY: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 3,
            gap: 5,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ pl: 2 }}
            fontWeight="bold"
          >
            Notifications
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              value={filterBy}
              size="small"
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{
                minWidth: 80,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography color="#92929D">Sort by:</Typography>
          <Select
            value={sortBy}
            size="small"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              minWidth: 80,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="age">Age</MenuItem>
          </Select>
          <IconButton>
            <FilterAltOutlinedIcon sx={{ color: "#9FA3A8" }} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#0A5FBF",
              borderRadius: 2.06,
            }}
            onClick={() => navigate("/sendvendornotification")}
          >
            Send Notifications
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{ mb: 4, display: "flex", alignItems: "center", p: 1, gap: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Search by Name, age, phone number"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3.06,
              height: 45,
              "& fieldset": { borderColor: "#DFDFDF" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            sx={{
              borderRadius: 3.06,
              height: 45,
            }}
            defaultValue="name"
            variant="outlined"
          >
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <VendorNotification notifications={paginatedSellers} />

      <Vendornotificationpagination
        totalItems={filteredNotification.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default NotificationVendor;
