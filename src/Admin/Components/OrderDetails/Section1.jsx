import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Breadcrumbs,
  Link,
  Avatar,
  Select,
  MenuItem,
  DialogActions,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Event as CalendarIcon,
  CreditCard as PaymentIcon,
  LocalShipping as ShippingIcon,
  Person as CustomerIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as InvoiceIcon,
  Settings as RewardsIcon,
  StoreMallDirectoryTwoTone,
  PersonPinCircleOutlined,
  LocationCity,
  Call,
} from "@mui/icons-material";
import * as XLSX from 'xlsx';

import {
  settleOrderAmountApi,
  updateOrderStatusApi,
} from "../../../services/allApi";
import { toast, ToastContainer } from "react-toastify";

const orderData = {
  orderId: "#302011",
  status: "Processing",
  addedDate: "12 Dec 2022",
  paymentMethod: "Visa",
  shippingMethod: "Flat Shipping",
  customerName: "Josh Adam",
  customerEmail: "josh_adam@mail.com",
  customerPhone: "909 427 2910",
  invoiceId: "INV-32011",
  shippingId: "SHP-2011REG",
  rewardPoints: "480 points",
};

const OrderDetailsSection = ({ order }) => {
  const [status, setStatus] = useState(order.orderStatus || "Processing");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  console.log("section1", order);
  const settled = order?.settled ?? false;
  const orderId = order._id;

  const handleSettle = async () => {
    const isSettled = true; 
    setLoading(true);

    const response = await settleOrderAmountApi(orderId, isSettled);
    console.log("settled data", response);

    setLoading(false);

    if (response?.success) {
      setSnackbar({
        open: true,
        message: `Order marked as ${isSettled ? "settled" : "not settled"}`,
        severity: "success",
      });
      setOpen(false);
    } else {
      setSnackbar({
        open: true,
        message: response?.error || "Settlement failed",
        severity: "error",
      });
    }
  };
  const item = order.items[0]; // or loop if there are multiple
  const sellers = item?.product?.owner;
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const response = await updateOrderStatusApi(order._id, newStatus);
      if (response.success) {
        toast.success("Order status updated successfully");
      } else {
        throw new Error(response.error || "Failed to update order status");
      }
    } catch (error) {
      setStatus(order.orderStatus || "Processing");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleExport = () => {
    // Format the order data for Excel
    const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const itemsData = order.items.map((item, index) => ({
      'Item #': index + 1,
      'Product': item.product.name,
      'Quantity': item.quantity,
      'Price': `₹${item.price.toFixed(2)}`,
      'Subtotal': `₹${(item.quantity * item.price).toFixed(2)}`
    }));
    
    // Create the main worksheet data
    const mainData = [
      { A: 'Order Details', B: '' },
      { A: 'Order ID:', B: order.mainOrderId },
      { A: 'Order Date:', B: orderDate },
      { A: 'Order Status:', B: order.orderStatus },
      { A: 'Payment Method:', B: order.paymentMethod },
      { A: 'Payment Status:', B: order.paymentStatus },
      { A: 'Settlement Status:', B: order.settled ? 'Settled' : 'Not Settled' },
      { A: '', B: '' },
      { A: 'Customer Information', B: '' },
      { A: 'Name:', B: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` },
      { A: 'Email:', B: order.user?.email || '' },
      { A: 'Phone:', B: order.shippingAddress.phone },
      { A: '', B: '' },
      { A: 'Shipping Address', B: '' },
      { A: 'Address:', B: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2}` },
      { A: 'City:', B: order.shippingAddress.city },
      { A: 'State:', B: order.shippingAddress.state },
      { A: 'Zip Code:', B: order.shippingAddress.zipCode },
      { A: 'Country:', B: order.shippingAddress.country },
      { A: '', B: '' },
      { A: 'Seller Information', B: '' },
      { A: 'Store Name:', B: sellers.businessname || sellers.ownername },
      { A: 'Owner Name:', B: sellers.ownername },
      { A: 'Location:', B: `${sellers.businesslocation || sellers.city}, ${sellers.state}` },
      { A: 'Contact:', B: sellers.number },
      { A: '', B: '' },
      { A: 'Order Summary', B: '' },
      { A: 'Total Price:', B: `₹${order.totalPrice.toFixed(2)}` },
      { A: 'Shipping ID:', B: order.shiprocketShipmentId || 'N/A' },
    ];
  
    // Create workbook and add sheets
    const wb = XLSX.utils.book_new();
    
    // Add main information sheet
    const mainWs = XLSX.utils.json_to_sheet(mainData, {skipHeader: true});
    XLSX.utils.book_append_sheet(wb, mainWs, 'Order Details');
    
    // Add items sheet
    if (itemsData.length > 0) {
      const itemsWs = XLSX.utils.json_to_sheet(itemsData);
      XLSX.utils.book_append_sheet(wb, itemsWs, 'Order Items');
    }
    
    // Apply some styling (column widths)
    const mainWsCols = [
      {wch: 20}, // Column A width
      {wch: 40}  // Column B width
    ];
    mainWs['!cols'] = mainWsCols;
    
    // Generate Excel file and trigger download
    const fileName = `Order_${order.mainOrderId}_${orderDate.replace(/\s/g, '_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box>
        <Typography variant="h4">Order Details</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Breadcrumbs separator="›">
          <Link href="#" underline="hover" color="#5C59E8">
            Dashboard
          </Link>
          <Link href="#" underline="hover" color="#5C59E8">
            Order List
          </Link>
          <Typography color="text.primary">Order Details</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            disabled={settled}
            onClick={() => setOpen(true)}
          >
            {settled ? "Settled" : "Settle"}
          </Button>
          <Select
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 140,
              backgroundColor: "#E3E8FF",
              color: "#5C59E8",
              fontWeight: "bold",
            }}
          >
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>

            <MenuItem value="Completed">Completed</MenuItem>
          </Select>

          <Button variant="outlined" onClick={handleExport}>Export</Button>

          {/* <Button
            variant="contained"
            sx={{ backgroundColor: "#1565C0", color: "white" }}
          >
            Invoice
          </Button> */}
        </Box>
      </Box>
      {/* Order Details Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Order Info */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Card
            sx={{
              borderRadius: 3,
              width: "100%",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
                  Order
                </Typography>
                <Chip
                  label="Processing"
                  size="small"
                  sx={{
                    backgroundColor: "#FFECD1",
                    color: "#D84315",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <CalendarIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Added
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <PaymentIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {order.paymentMethod}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <ShippingIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Shipping Method
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      Shiprocket
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Info */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Card
            sx={{
              borderRadius: 3,
              width: "100%",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Customer
              </Typography>

              <Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <CustomerIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <EmailIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {order.user?.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <PhoneIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {order.shippingAddress.phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Info */}
        {/* <Grid item xs={12} md={3} sx={{ display: "flex" }}>
          <Card
            sx={{
              borderRadius: 3,
              width: "100%",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Document
              </Typography>

              <Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <InvoiceIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Invoice
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {orderData.invoiceId}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <ShippingIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {orderData.shippingId}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <RewardsIcon sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Rewards
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {orderData.rewardPoints}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Seller Info */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Card
            sx={{
              borderRadius: 3,
              width: "100%",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Seller
              </Typography>

              <Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <StoreMallDirectoryTwoTone
                      sx={{ color: "#5C59E8", fontSize: 16 }}
                    />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Store Name
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {sellers.businessname || sellers.ownername}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <PersonPinCircleOutlined
                      sx={{ color: "#5C59E8", fontSize: 16 }}
                    />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Owner
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {sellers.ownername}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <LocationCity sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {sellers.businesslocation || sellers.city},{" "}
                      {sellers.state}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#E3E8FF",
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <Call sx={{ color: "#5C59E8", fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Contact
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {sellers.number}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Seller Bank Details</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Seller Name</Typography>
              <TextField
                fullWidth
                value={sellers.ownername}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Account Number</Typography>
              <TextField
                fullWidth
                value={sellers.accountNumber}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">IFSC Code</Typography>
              <TextField
                fullWidth
                value={sellers.ifscCode}
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSettle}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Processing..." : "Confirm Settle"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ToastContainer></ToastContainer>
    </Box>
  );
};

export default OrderDetailsSection;
