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

const socket = io(`${BASE_URL}`);

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const userType = "Vendor";
  const userId = localStorage.getItem("rigsdock_vendorid");
  const adminId = "67c0043a8a2ba150254a73ae";

  useEffect(() => {
    if (!userId || !userType) return;

    // Join room
    socket.emit("joinRoom", { userId, room: adminId });

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      console.log("New Message Received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, userType]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("rigsdock_accessToken");
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/vendor/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      sender: userId,
      senderType: userType,
      receiver: adminId,
      receiverType: "Admin",
      message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, messageData]);

    socket.emit("sendMessage", messageData, (ack) => {
      if (!ack?.success) {
        console.error("Message not delivered:", ack?.error);
      }
    });

    setMessage("");
  };

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
          Chat Support
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
            messages.map((msg, index) => {
              const isCurrentUser =
                msg.senderType === userType && msg.sender === userId;

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  {!isCurrentUser && (
                    <Avatar sx={{ mr: 1, bgcolor: "secondary.main" }}>
                      {msg.senderType === "Admin" ? "A" : "V"}
                    </Avatar>
                  )}

                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: "70%",
                      borderRadius: "10px",
                      bgcolor: isCurrentUser ? "primary.light" : "grey.300",
                      color: isCurrentUser ? "white" : "inherit",
                      textAlign: "left",
                    }}
                  >
                    <Typography variant="body2">{msg.message}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: isCurrentUser ? "rgba(255,255,255,0.8)" : "gray",
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Paper>

                  {isCurrentUser && (
                    <Avatar sx={{ ml: 1, bgcolor: "primary.main" }}>
                      {userType === "Vendor" ? "V" : userType.charAt(0)}
                    </Avatar>
                  )}
                </Box>
              );
            })
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <IconButton color="primary" onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;
