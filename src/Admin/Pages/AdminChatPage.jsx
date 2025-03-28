import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../../services/baseUrl";
import { useParams } from "react-router-dom";

const socket = io(`${BASE_URL}`);

const AdminChatPage = () => {
  const { sellerId: vendorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const adminId = localStorage.getItem("rigsdock_adminid");

  useEffect(() => {
    if (vendorId) {
      // Join room with specific vendor
      socket.emit("joinRoom", { 
        userId: adminId, 
        userType: "Admin", 
        room: vendorId 
      });

      // Listen for new messages specifically from this vendor
      socket.on("receiveMessage", (newMessage) => {
        // Ensure the message is for this specific vendor conversation
        if (newMessage.sender === vendorId || newMessage.receiver === vendorId) {
          setMessages((prevMessages) => {
            // Prevent duplicate messages
            const isMessageExists = prevMessages.some(
              msg => msg.timestamp === newMessage.timestamp
            );
            
            return isMessageExists 
              ? prevMessages 
              : [...prevMessages, newMessage];
          });
        }
      });
      
      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [vendorId, adminId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("rigsdock_accessToken");
        const response = await axios.get(
          `${BASE_URL}/admin/chat/history/${vendorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [vendorId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isAdminMessage = (msg) => {
    return msg.senderType === "Admin" || msg.sender === adminId;
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      sender: adminId,
      senderType: "Admin",
      receiver: vendorId,
      receiverType: "Vendor",
      message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage("");
  };

  // Rest of the component remains the same...

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "white",
      }}
    >
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="h6" align="center" fontWeight="bold" mb={1}>
          Vendor Support Chat
        </Typography>

        <Box
          sx={{
            height: "400px",
            overflowY: "auto",
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: isAdminMessage(msg) ? "row-reverse" : "row",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                {!isAdminMessage(msg) && (
                  <Avatar sx={{ mr: 1 }}>{msg.senderType && msg.senderType[0]}</Avatar>
                )}
                <Paper
                  sx={{
                    p: 1,
                    maxWidth: "70%",
                    borderRadius: "10px",
                    bgcolor:
                      isAdminMessage(msg) ? "primary.light" : "grey.300",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "gray" }}
                  >
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "Just now"}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
          <div ref={chatEndRef} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <TextField
            fullWidth
            label="Type a message..."
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <IconButton color="primary" onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminChatPage;