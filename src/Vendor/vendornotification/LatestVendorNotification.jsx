import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useNavigate } from "react-router-dom";
import { getvendornotificationApi } from "../../services/allApi";

const LatestVendorNotification = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await getvendornotificationApi();
        console.log(response);
        
        if (response.status === 200) {
          // Sort notifications by date (newest first) and take only the latest 10
          const sortedNotifications = response.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);

          setNotifications(sortedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (open) {
      fetchNotification();
    }
  }, [open]); // Fetch data when modal opens

  const handleNavigate = () => {
    onClose(); // Close the modal
    navigate("/vendornotification"); // Navigate to notifications page
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: `
            0px 22px 13px -18px #8774571A, 
            0px 10px 9px -4px #8774571A, 
            0px 1px 3px 0px #8774571A, 
            0px 1px 2px 0px #8774571A, 
            0px -1px 15px 0px #8774571A
          `,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Helvetica",
              fontWeight: 700,
              fontSize: "16.38px",
              lineHeight: "19.66px",
              color: "#0A5FBF",
            }}
          >
            Latest Notifications
          </Typography>
          <Button variant="outlined" sx={{ px: 3 }} onClick={() => setNotifications([])}>
            Mark all read
          </Button>
        </Box>

        <List sx={{ mt: 2 }}>
          {notifications.map((notification) => (
            <ListItem key={notification._id} divider>
              <ListItemAvatar>
                <Avatar>{notification.image}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.title}
                secondary={`${notification.description} · ${formatDate(notification.createdAt)}`}
              />
              {notification.unread && (
                <FiberManualRecordIcon sx={{ color: "#0A5FBF", fontSize: "10px", ml: 1 }} />
              )}
            </ListItem>
          ))}
        </List>

        <Box display="flex" justifyContent="flex-start" mt={2}>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#0A5FBF",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={handleNavigate}
          >
            Previous Notifications
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default LatestVendorNotification;
