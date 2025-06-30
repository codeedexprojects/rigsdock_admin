import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { getvendorSubCategoriesApi } from "../../services/allApi";
import {  IMG_BASE_URL } from "../../services/baseUrl";

const Viewsubcategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("Default");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getvendorSubCategoriesApi(page);
        console.log("subcategories", response);

        if (response.success) {
          setSubCategories(response.data.subCategories);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setError("Failed to load subcategories.");
        }
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [page]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const filteredSubCategories = subCategories
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.variants &&
          item.variants.some((v) =>
            v.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    )
    .sort((a, b) => (sort === "Name" ? a.name.localeCompare(b.name) : 0));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Sub Category List
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Show:</Typography>
          <Select defaultValue="All Products" variant="outlined" size="small">
            <MenuItem value="All Products">All Products</MenuItem>
            <MenuItem value="Category 1">Category 1</MenuItem>
            <MenuItem value="Category 2">Category 2</MenuItem>
          </Select>
          <Typography>Sort by:</Typography>
          <Select
            onChange={(e) => setSort(e.target.value)}
            defaultValue="Default"
            variant="outlined"
            size="small"
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
          </Select>
          <IconButton>
            <FilterList />
          </IconButton>
        
        </Box>
      </Box>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search by Name, category, Variant etc..."
        sx={{ mb: 3 }}
      />

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box mt={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

{!loading && !error && filteredSubCategories.length > 0 && (
  <Grid container spacing={3}>
    {filteredSubCategories.map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item._id}>
        <Card sx={{ 
          p: 2, 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {item.name}
            </Typography>
            <Typography color="primary">{item._id}</Typography>
            <Typography variant="body2" mt={1} sx={{ mb: 2 }}>
              {typeof item.description === "string"
                ? item.description
                : JSON.stringify(item.description)}
            </Typography>
          </Box>
          
          <Box 
            display="flex" 
            justifyContent="space-between" 
            mt="auto"
            pt={1}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                color="#9FA3A8"
                fontWeight={600}
                display="block"
              >
                CATEGORY
              </Typography>
              <Typography style={{ textAlign: "center" }}>
                <b>{item.category?.name || "N/A"}</b>
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                color="#9FA3A8"
                fontWeight={600}
                display="block"
              >
                PRODUCTS
              </Typography>
              <Typography style={{ textAlign: "center" }}>
                <b>{item.productCount || "0"}</b>
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                color="#9FA3A8"
                fontWeight={600}
                display="block"
              >
                STATUS
              </Typography>
              <Typography>
                <b>{item.status}</b>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
)}
      {!loading && !error && subCategories.length === 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography>No subcategories found.</Typography>
        </Box>
      )}
      {!loading && !error && subCategories.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      )}
    </Box>
  );
};
export default Viewsubcategory;
