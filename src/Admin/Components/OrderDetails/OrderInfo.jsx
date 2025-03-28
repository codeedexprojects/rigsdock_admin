import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Place as AddressIcon,
  ShoppingCart as OrderPlacedIcon,
  Settings as ProcessingIcon,
  Inventory as PackedIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
} from "@mui/icons-material";

// Order Status Data
const orderStatus = [
  {
    label: "Order Placed",
    description: "An order has been placed.",
    date: "12/12/2022, 03:00",
    icon: <OrderPlacedIcon sx={{ color: "#5C59E8" }} />,
    active: true,
  },
  {
    label: "Processing",
    description: "Seller has processed your order.",
    date: "12/12/2022, 03:15",
    icon: <ProcessingIcon sx={{ color: "#5C59E8" }} />,
    active: true,
  },
  {
    label: "Packed",
    description: "Your order is being packed.",
    date: "DD/MM/YY, 00:00",
    icon: <PackedIcon sx={{ color: "#A0A0A0" }} />,
    active: false,
  },
  {
    label: "Shipping",
    description: "Your order is on the way.",
    date: "DD/MM/YY, 00:00",
    icon: <ShippingIcon sx={{ color: "#A0A0A0" }} />,
    active: false,
  },
  {
    label: "Delivered",
    description: "Your order has been delivered.",
    date: "DD/MM/YY, 00:00",
    icon: <DeliveredIcon sx={{ color: "#A0A0A0" }} />,
    active: false,
  },
];

const OrderInfo = ({ order }) => {
  const shippingAddress = order?.shippingAddress || {};

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
      {/* Address Section */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Address
          </Typography>

          {/* Shipping Address */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#E3E8FF" }}>
              <AddressIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography fontWeight="bold">Shipping</Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingAddress.fullName}, {shippingAddress.addressLine1}, {shippingAddress.addressLine2}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zipCode}, {shippingAddress.country}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {shippingAddress.phone}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Order Status Section */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Order Status
          </Typography>

          <Stack spacing={2}>
            {orderStatus.map((status, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                {/* Status Icon */}
                <Avatar sx={{ bgcolor: status.active ? "#E3E8FF" : "#F0F0F0", mr: 2 }}>
                  {status.icon}
                </Avatar>

                {/* Status Details */}
                <Box>
                  <Typography fontWeight="bold">{status.label}</Typography>
                  {status.description && (
                    <Typography variant="body2" color="text.secondary">
                      {status.description}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {status.date}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderInfo;
