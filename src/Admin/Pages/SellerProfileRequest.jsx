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
  Menu,
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
  getSellerProfileRequestApi,
  updateSellerProfileRequestApi,
} from "../../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const SellerProfileRequest = () => {
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState("Default");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [sellerRequests, setSellerRequest] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rowsPerPage] = useState(5);

  const fetchSellerRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getSellerProfileRequestApi();
      console.log(response);
      if (response.status === 200) {
        const { vendors, message } = response.data;
        if (vendors && vendors.length > 0) {
          setSellerRequest(vendors);
          setMessage("");
        } else {
          setSellerRequest([]);
          setMessage(message || "No Pending Vendors");
        }
      }
    } catch (error) {
      console.error("Error fetching seller requests:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerRequests();
  }, []);

  useEffect(() => {
    let filtered = sellerRequests.filter((vendor) =>
      vendor.ownername.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sort === "Name") {
      filtered.sort((a, b) => a.ownername.localeCompare(b.ownername));
    } else if (sort === "Date") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredRequests(filtered);
  }, [searchQuery, sort, sellerRequests]);

  const handleCheckboxChange = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  const handleStatusUpdate = async (status) => {
    if (!selectedRow) return;

    // Optimistic UI Update
    setSellerRequest((prevRequests) =>
      prevRequests.map((req) =>
        req._id === selectedRow._id ? { ...req, status } : req
      )
    );

    try {
      const response = await updateSellerProfileRequestApi(selectedRow._id, {
        status,
      });

      if (response.success) {
        toast.success("Status updated successfully!");
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      // Revert UI Update on Error
      setSellerRequest((prevRequests) =>
        prevRequests.map((req) =>
          req._id === selectedRow._id
            ? { ...req, status: selectedRow.status }
            : req
        )
      );

      toast.error(error.message || "An error occurred while updating status");
    }

    handleMenuClose();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Seller Profile Requests
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
              {sellerRequests.length === 0 ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  sx={{ py: 3 }}
                >
                  <ReportProblemOutlinedIcon
                    sx={{ fontSize: 40, color: "gray" }}
                  />
                  <Typography variant="h6" color="textSecondary">
                    No Seller Profile Requests Found
                  </Typography>
                </Stack>
              ) : (
                paginatedRequests.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderRadius: "10px",
                      transition: "0.3s",
                      "&:hover": { backgroundColor: "#F5F5F5" },
                    }}
                  >
                    {/* <TableCell>
                      <Checkbox
                        checked={selected.includes(row._id)}
                        onChange={() => handleCheckboxChange(row._id)}
                      />
                    </TableCell> */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={row.images?.[0] || ""} />
                        <Typography>{row.pendingUpdates.ownername}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.pendingUpdates._id}</TableCell>
                    <TableCell>{row.pendingUpdates.email}</TableCell>
                    <TableCell>{row.pendingUpdates.number}</TableCell>
                    <TableCell>
                      {format(new Date(row.updatedAt), "MMMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>{row.updateProfile}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => handleStatusUpdate("approved")}
                        >
                          Approve
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusUpdate("rejected")}
                        >
                          Reject
                        </MenuItem>
                      </Menu>
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
          count={Math.ceil(filteredRequests.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
        />{" "}
      </Box>
      <ToastContainer></ToastContainer>
    </Box>
  );
};

export default SellerProfileRequest;
