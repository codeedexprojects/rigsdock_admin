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
} from "@mui/material";
import { MoreVert, FilterList } from "@mui/icons-material";
import {
  getSellerRequestApi,
} from "../../services/allApi";
import { format } from "date-fns";
import SellerDetailsModal from "./SellerDetailsModal";

const SellerRequests = () => {
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
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (seller) => {
    setSelectedSeller(seller);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSeller(null);
  };
  const fetchSellerRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getSellerRequestApi();
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
      } else if (response.status === 404) {
        setSellerRequest([]);
        setMessage("No Seller Requests Found");
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

  const handleStatusUpdate = (sellerId, newStatus) => {
    setSellerRequest((prevRequests) =>
      prevRequests.map((req) =>
        req._id === sellerId ? { ...req, status: newStatus } : req
      )
    );
  };


  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Seller Requests
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
                <TableCell>SI NO</TableCell>

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
              {paginatedRequests.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "10px",
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#F5F5F5" },
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(row._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(row._id);
                      }}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={row.images?.[0] || ""} />
                      <Typography>{row.ownername}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>
                    {format(new Date(row.createdAt), "MMMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the row click event from firing
                        handleMenuOpen(e, row);
                      }}
                    >
                      <MoreVert />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleRowClick(selectedRow)}>
                        View Details
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
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
      <SellerDetailsModal
        open={modalOpen}
        handleClose={handleModalClose}
        seller={selectedSeller}
        onStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
};

export default SellerRequests;
