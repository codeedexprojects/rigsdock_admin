import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from "react";
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
  CircularProgress,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { getsellerApi } from "../../services/allApi";

const Cards = lazy(() => import("../Components/SellerPage/Cards"));
const Paginations = lazy(() => import("../Components/SellerPage/Paginations"));

const SellerPage = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await getsellerApi();
        console.log(response);

        if (response.status === 200) {
          setSellers(response.data.vendors);
        }
      } catch (error) {
        console.error("Error fetching sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const filteredSellers = useMemo(() => {
    let data = [...sellers];

    if (searchQuery) {
      data = data.filter((seller) =>
        seller.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (filterBy === "week") {
      data = data.filter((seller) => new Date(seller.createdAt) >= startOfWeek);
    } else if (filterBy === "month") {
      data = data.filter(
        (seller) => new Date(seller.createdAt) >= startOfMonth
      );
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.ownername.localeCompare(b.ownername));
    } else if (sortBy === "createdAt") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "updatedAt") {
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return data;
  }, [sellers, searchQuery, sortBy, filterBy]);

  const paginatedSellers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSellers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSellers, currentPage, itemsPerPage]);

  const handleSortChange = useCallback((e) => setSortBy(e.target.value), []);
  const handleFilterChange = useCallback(
    (e) => setFilterBy(e.target.value),
    []
  );
  const handleSearchChange = useCallback(
    (e) => setSearchQuery(e.target.value),
    []
  );

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ pl: 2 }}>
            Sellers
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="#92929D">Show:</Typography>
            <Select
              value={filterBy}
              size="small"
              onChange={handleFilterChange}
              sx={{
                minWidth: 100,
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
            onChange={handleSortChange}
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="createdAt">Latest Created</MenuItem>
            <MenuItem value="updatedAt">Latest Updated</MenuItem>
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
            onClick={() => navigate("/addSeller")}
          >
            New Seller
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Paper
        elevation={0}
        sx={{ mb: 4, display: "flex", alignItems: "center", p: 1, gap: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Search ......"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
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
            sx={{ borderRadius: 3.06, height: 45 }}
            defaultValue="name"
            variant="outlined"
          >
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <CircularProgress size={50} color="primary" />
        </Box>
      ) : (
        <>
          <Suspense fallback={<CircularProgress size={40} />}>
            <Cards sellers={paginatedSellers} />
          </Suspense>

          <Suspense fallback={<CircularProgress size={40} />}>
            <Paginations
              totalItems={filteredSellers.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Suspense>
        </>
      )}
    </Box>
  );
};

export default SellerPage;
