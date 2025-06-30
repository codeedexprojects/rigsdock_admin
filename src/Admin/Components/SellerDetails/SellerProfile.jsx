import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  Lock as UserIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Place as PlaceIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { IMG_BASE_URL } from "../../../services/baseUrl";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const SellerProfileCard = ({ seller }) => {
  return (
    <Card
      sx={{ width: 320, borderRadius: 3, boxShadow: 3, overflow: "hidden" }}
    >
      {/* Banner */}
      <Box
        sx={{
          height: 80,
          backgroundImage: `url(${
            seller.storelogo
              ? `https://your-image-path.com/${seller.storelogo}`
              : "https://i.imgur.com/OyYOFsU.png"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <CardContent sx={{ textAlign: "center", mt: -6 }}>
        {/* Profile Image */}
        <Avatar
          src={
            seller.images[0]
              ? `${IMG_BASE_URL}/uploads/${seller.storelogo}`
              : "https://i.imgur.com/QXUb9Uy.jpg"
          }
          alt={seller.ownername}
          sx={{
            width: 90,
            height: 90,
            border: "4px solid white",
            mx: "auto",
          }}
        />

        {/* Name & Badge */}
        <Typography variant="h6" fontWeight="bold" mt={1}>
          {seller.ownername || "N/A"}
        </Typography>
        {seller.status === "approved" && (
          <Chip
            label="Approved"
            size="small"
            sx={{
              bgcolor: "#E3E8FF",
              color: "#5C59E8",
              fontSize: "0.7rem",
              height: 20,
              fontWeight: "bold",
            }}
          />
        )}
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          @{seller.businessname || "Unknown"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* User Information List */}
        <Stack spacing={2.5} alignItems="flex-start">
          <Box sx={{ display: "flex", alignItems: "left", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <UserIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller._id || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "left", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <EmailIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Billing Email
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller.email || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "left", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <PhoneIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller.number || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <PlaceIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Shop Address
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller.address || "N/A"}, {seller.city}, {seller.state},{" "}
                {seller.pincode}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <AccountBalanceIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                IFSC
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller.ifscCode || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <ReceiptIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                GST
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller.gstNumber || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <CreditCardIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                PAN
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller.panNumber || "N/A"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
  <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
    <CreditCardIcon sx={{ color: "#5C59E8" }} />
  </Avatar>
  <Box>
    <Typography variant="body2" color="text.secondary">
      Passbook Photo
    </Typography>
    {seller.passbookPhoto ? (
      <Typography variant="body1" fontWeight="bold">
        <a
          href={`${IMG_BASE_URL}/uploads/${seller.passbookPhoto}`}
             View Image       target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline", color: "#5C59E8" }}
        >

        </a>
      </Typography>
    ) : (
      <Typography variant="body1" fontWeight="bold">
        N/A
      </Typography>
    )}
  </Box>
</Box>



          
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Avatar sx={{ bgcolor: "#E3E8FF", mr: 2, width: 32, height: 32 }}>
              <CartIcon sx={{ color: "#5C59E8" }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Store Type
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {seller.storetype || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SellerProfileCard;
