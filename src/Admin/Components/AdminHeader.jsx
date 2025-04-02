import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Divider,
} from "@mui/material";
import {  Notifications } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";

// const SearchBar = styled(Paper)({
//   padding: "2px 4px",
//   display: "flex",
//   border: "none",
//   alignItems: "center",
//   width: "100%",
//   maxWidth: 400,
//   borderRadius: 8,
//   boxShadow: "none",
//   marginRight: "16px",
// });

const AdminHeader = () => {
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

          <IconButton>
            <Badge
              badgeContent="9"
              color="error"
              max={99}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Notifications sx={{ color: "#454F5B" }} />
            </Badge>
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 40, mx: 2 }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Avatar src="/avatar-placeholder.jpg" />
            <Box>
              <Typography variant="subtitle2">Ziyad</Typography>
              <Typography variant="caption" color="#0A5FBF">
                Admin
              </Typography>
            </Box>
            <IconButton size="small">
              <ExpandCircleDownOutlinedIcon sx={{ color: "#212B36" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AdminHeader;
