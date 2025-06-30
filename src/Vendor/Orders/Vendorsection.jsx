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
} from "@mui/material";
import {
  Event as CalendarIcon,
  CreditCard as PaymentIcon,
  LocalShipping as ShippingIcon,
  Person as CustomerIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as InvoiceIcon,
} from "@mui/icons-material";
import * as XLSX from 'xlsx';

import { toast, ToastContainer } from "react-toastify";
import {
  downloadVendorInvoice,
  updateVendorOrderStatusApi,
} from "../../services/allApi";

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

const Vendorsection = ({ order }) => {
  const [status, setStatus] = useState(order.orderStatus || "Processing");
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadError, setDownloadError] = React.useState(null);

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      const result = await downloadVendorInvoice(order._id);

      if (!result.success) {
        setDownloadError(result.error);
      }
    } catch (error) {
      setDownloadError(error.message || "Failed to download invoice");
    } finally {
      setIsDownloading(false);
    }
  };
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const response = await updateVendorOrderStatusApi(order._id, newStatus);
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
      {/* Breadcrumb Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs separator="›">
          <Link href="#" underline="hover" color="#5C59E8">
            Dashboard
          </Link>
          <Link href="#" underline="hover" color="#5C59E8">
            Order List
          </Link>
          <Typography color="text.primary">Order Details</Typography>
        </Breadcrumbs>

        {/* Action Buttons (Status Dropdown + Export + Invoice) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Static Status Dropdown */}
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

          {/* Export Button */}
          <Button variant="outlined" onClick={handleExport}>Export</Button>

          {/* Invoice Button */}
          <Button
            variant="contained"
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            sx={{ backgroundColor: "#1565C0", color: "white" }}
          >
          {isDownloading ? "Downloading..." : "Invoice"}

            
          </Button>
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
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Customer
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <CustomerIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <EmailIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {order.user.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <PhoneIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {order.shippingAddress.phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Document
              </Typography>
              <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
    <InvoiceIcon sx={{ color: "#5C59E8" }} />
  </Avatar>
  <Box>
    <Button
      onClick={handleDownloadInvoice}
      disabled={isDownloading}
      variant="contained"
      sx={{
        backgroundColor: "#5C59E8",
        color: "white",
        textTransform: "none",
        px: 3,
        py: 1,
        borderRadius: 2,
        boxShadow: 2,
        "&:hover": {
          backgroundColor: "#4B48D6",
        },
        "&:disabled": {
          backgroundColor: "#A9A8E0",
          color: "#EDEDED",
        },
      }}
    >
      {isDownloading ? "Downloading..." : "Download Invoice"}
    </Button>
  </Box>
</Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <ShippingIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shiprocket ShipmentId
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {order.shiprocketShipmentId}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <ShippingIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shiprocet Order ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {order.shiprocketOrderId}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer></ToastContainer>
    </Box>
  );
};

export default Vendorsection;
