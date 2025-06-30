import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LatestNotification from "./Notification/LatestNotification";
import LatestVendorNotification from "../../Vendor/vendornotification/LatestVendorNotification";

const AdminHeader = () => {
  const vendor = localStorage.getItem("rigsdock_vendor");
  const admin = localStorage.getItem("rigsdock_admin");
  const [openModal, setOpenModal] = useState(null); 

  const handleNotificationClick = () => {
    if (vendor) {
      setOpenModal("vendor");
    } else if (admin) {
      setOpenModal("admin");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          boxShadow: "0px 1.97px 3.95px rgba(0, 0, 0, 0.15)",
          backgroundColor: "white",
          zIndex: 1000,
          px: 3,
        }}
      >
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton sx={{ color: "#454F5B" }}>
            <CalendarMonthRoundedIcon />
          </IconButton>
          <Typography sx={{ color: "#0A5FBF", ml: -1.8 }}>
            {new Date().toLocaleDateString("en-GB")}
          </Typography>

          <IconButton onClick={handleNotificationClick}>
            {/* <Badge
              badgeContent="9"
              color="error"
              max={99}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            > */}
              <Notifications sx={{ color: "#454F5B" }} />
            {/* </Badge> */}
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 40, mx: 2 }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              padding: "6px 10px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <Avatar
              src="/avatar-placeholder.jpg"
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  color: "#333",
                  fontSize: "14px",
                  lineHeight: 1.2,
                }}
              >
                {vendor ? "Vendor" : admin ? "Admin" : ""}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {openModal === "admin" && <LatestNotification open={true} onClose={handleCloseModal} />}
      {openModal === "vendor" && <LatestVendorNotification open={true} onClose={handleCloseModal} />}
    </div>
  );
};

export default AdminHeader;
