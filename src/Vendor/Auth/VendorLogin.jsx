import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { vendorLoginApi } from "../../services/allApi";

function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await vendorLoginApi({ email, password });

      if (response.status === 200) {
        const { accessToken, refreshToken, admin } = response.data;
        localStorage.removeItem("rigsdock_admin");

        localStorage.setItem("rigsdock_accessToken", accessToken);
        localStorage.setItem("rigsdock_refreshToken", refreshToken);
        localStorage.setItem("rigsdock_vendor", admin);
        localStorage.setItem("rigsdock_vendorid", admin.id);

        setSnackbarMessage("Login successful!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/vendor-dashboard"), 1500);
      } else {
        throw new Error("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setSnackbarMessage(err.message || "Something went wrong. Please try again later.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }

    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{ padding: 4, borderRadius: 3, mt: 8, textAlign: "center", backgroundColor: "#f5f5f5" }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <LockIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Vendor Login
          </Typography>
        </Box>

        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && error.includes("Email")}
            helperText={error && error.includes("Email") ? error : ""}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error && error.includes("Password")}
            helperText={error && error.includes("Password") ? error : ""}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #007BFF 30%, #0056D2 90%)",
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default VendorLogin;
