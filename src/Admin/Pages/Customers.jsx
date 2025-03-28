import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
  MenuItem,
  Pagination,
  Select,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { MoreVert, FilterList } from "@mui/icons-material";
import { format } from "date-fns";
import {
 getCustomersApi
} from "../../services/allApi";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const Customers = () => {
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState("Default");
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [filteredcustomers, setFilteredcustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rowsPerPage] = useState(5);


  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCustomersApi();
      console.log(response); // Debugging log
  
      // Ensure response has the expected structure
      if (response.status === 200 && response.data) {
        const customersData = response.data.data; // ✅ Correct way to extract data
        setCustomers(customersData);
      } else {
        setError("Unexpected response format");
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  
  

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!Array.isArray(customers)) return; // Ensure customers is an array
  
    let filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) // ✅ Use "name"
    );
  
    if (sort === "Name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name)); // ✅ Sort by "name"
    } else if (sort === "Date") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  
    setFilteredcustomers(filtered);
  }, [searchQuery, sort, customers]);
  

  const handleCheckboxChange = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };




  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRequests = Array.isArray(filteredcustomers) ? filteredcustomers.slice(startIndex, endIndex) : [];
  
 

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Customers
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            placeholder="Search by Name, category, Variant etc..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            size="small"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="Default">Sort by: Default</MenuItem>
            <MenuItem value="Name">Sort by: Name</MenuItem>
            <MenuItem value="Date">Sort by: Date</MenuItem>
          </Select>

          <IconButton>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      <TableContainer sx={{ mt: 3, borderRadius: "10px", boxShadow: 2 }}>
  {loading ? (
    <Box display="flex" justifyContent="center" p={5}>
      <CircularProgress />
    </Box>
  ) : error ? (
    <Alert severity="error">{error}</Alert>
  ) : message ? (
    <Box textAlign="center" p={3}>
      <Typography>{message}</Typography>
    </Box>
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox />
          </TableCell>
          <TableCell>Seller Name</TableCell>
          <TableCell>#ID</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
  {paginatedRequests && paginatedRequests.length === 0 ? ( 
    <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 3 }}>
      <ReportProblemOutlinedIcon sx={{ fontSize: 40, color: "gray" }} />
      <Typography variant="h6" color="textSecondary">
        No Customers found
      </Typography>
    </Stack>
  ) : (
    paginatedRequests.map((row) => (
      <TableRow key={row._id}>
        <TableCell>
          <Checkbox
            checked={selected.includes(row._id)}
            onChange={() => handleCheckboxChange(row._id)}
          />
        </TableCell>
        <TableCell>{row.name}</TableCell> {/* ✅ Ensure "name" is used correctly */}
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.mobileNumber}</TableCell>
        <TableCell>{format(new Date(row.createdAt), "MMMM d, yyyy h:mm a")}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>
          <IconButton>
            <MoreVert />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>


    </Table>
  )}
</TableContainer>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredcustomers.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
        />{" "}
      </Box>
    </Box>
  );
};

export default Customers;
