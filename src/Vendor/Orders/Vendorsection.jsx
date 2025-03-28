import React from "react";
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
  Settings as RewardsIcon,
} from "@mui/icons-material";

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
            defaultValue="Processing"
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
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>

          {/* Export Button */}
          <Button variant="outlined">Export</Button>

          {/* Invoice Button */}
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1565C0", color: "white" }}
          >
            Invoice
          </Button>
        </Box>
      </Box>
      {/* Order Details Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Order Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Order {orderData.orderId}
                <Chip
                  label="Processing"
                  size="small"
                  sx={{
                    backgroundColor: "#FFECD1",
                    color: "#D84315",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    ml: 1,
                  }}
                />
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <CalendarIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Added
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {orderData.addedDate}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <PaymentIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {orderData.paymentMethod}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <ShippingIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shipping Method
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {orderData.shippingMethod}
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
                      {orderData.customerName}
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
                      {orderData.customerPhone}
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
                    <Typography variant="body2" color="text.secondary">
                      Invoice
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {orderData.invoiceId}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <ShippingIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {orderData.shippingId}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2 }}>
                    <RewardsIcon sx={{ color: "#5C59E8" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Rewards
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {orderData.rewardPoints}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Vendorsection;
