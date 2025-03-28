import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from "@mui/material";

const OrderList = ({ order }) => {
  if (!order || !order.items) {
    return (
      <Typography color="error" align="center">
        Order data is not available.
      </Typography>
    );
  }

  const { items, totalPrice, coupon } = order;
  const discountAmount = coupon ? coupon.discountAmount : 0;
  console.log(discountAmount);
  
  const shippingRate = 5;
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Order List
          </Typography>
          <Chip label={`${order.items?.length ?? 0} Products`} sx={{ backgroundColor: "#E3F7E8", color: "#2E7D32", fontWeight: "bold" }} />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>PRODUCT</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>QTY</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>PRICE</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>TOTAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar src={item.product?.image || "https://via.placeholder.com/40"} variant="square" sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography fontWeight="bold">{item.product?.name || "Unknown"}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.product?.name || "No name available"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{item.sku || "N/A"}</TableCell>
                  <TableCell>{item.quantity || 0}</TableCell>
                  <TableCell>{item.price || "$0.00"}</TableCell>
                  <TableCell>{(item.price)*(item.quantity) || "$0.00"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}>Subtotal</TableCell>
                <TableCell align="right" sx={{ borderBottom: "none", fontWeight: "bold" }}>
                {subtotal ? `₹${subtotal.toFixed(2)}` : "$0.00"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}>Discount</TableCell>
                <TableCell align="right" sx={{ borderBottom: "none", fontWeight: "bold" }}>
                ₹{discountAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}>Shipping Rate</TableCell>
                <TableCell align="right" sx={{ borderBottom: "none", fontWeight: "bold" }}>
                  {`₹${shippingRate.toFixed(2)}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontSize: "1rem", fontWeight: "bold" }}>Grand Total</TableCell>
                <TableCell align="right" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                {totalPrice ? `₹${totalPrice.toFixed(2)}` : "$0.00"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderList;
