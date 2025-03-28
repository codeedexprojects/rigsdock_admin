import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { toast, ToastContainer } from "react-toastify";
import { createvendorNotificationApi } from "../../services/allApi";

function SendVendorNotification() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    destinationrole: "User",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.image || !formData.description) {
      toast.error("All fields are required!", { position: "top-right" });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("destinationrole", formData.destinationrole);
    formDataToSend.append("image", formData.image);

    setLoading(true);

    try {
      const response = await createvendorNotificationApi(formDataToSend);
      console.log(response);
      
      toast.success("Notification sent successfully!", { position: "top-right" });

      setFormData({
        title: "",
        description: "",
        image: null,
        destinationrole: "User",
      });
    } catch (error) {
      toast.error("Failed to send notification!", { position: "top-right" });
      console.error("Error creating notification:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Send Notifications
      </Typography>

      <Box display="flex" gap={4}>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            CUSTOM NOTIFICATION SETTING
          </Typography>
          <CardContent>
            <Box display="flex" gap={2}>
              <Box
                width={150}
                height={100}
                sx={{ backgroundColor: "lightgray", position: "relative" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Selected"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <ImageIcon fontSize="large" />
                )}
                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  sx={{ position: "absolute", bottom: 4, left: 4 }}
                >
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
              <Box flex={1}>
                <TextField
                  fullWidth
                  label="Enter Notification Title"
                  variant="outlined"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Box>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Select User Type
              </Typography>
              <Select
                value={formData.destinationrole}
                onChange={(e) =>
                  setFormData({ ...formData, destinationrole: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="User">Users</MenuItem>
                <MenuItem value="Vendor">Vendors</MenuItem>
              </Select>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#0A5FBF",
                "&:hover": { bgcolor: "primary.main" },
                width: "50%",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Publish"}
            </Button>
          </CardContent>
        </Card>
      </Box>
      <ToastContainer></ToastContainer>
    </Box>
  );
}

export default SendVendorNotification;

















//  {/* Left Column - Date and Time Selection */}
//  <Card sx={{ flex: 1, p: 2 }}>
//  <Typography variant="subtitle1" fontWeight={600} mb={2}>
//    SELECT DATE AND TIME SLOT
//  </Typography>

//  <LocalizationProvider dateAdapter={AdapterDayjs}>
//    <MobileDatePicker
//      label="Select Date"
//      inputFormat="MMMM D, YYYY"
//      value={selectedDate}
//      onChange={(newValue) => setSelectedDate(newValue)}
//      renderInput={(params) => <TextField {...params} fullWidth />}
//    />
//  </LocalizationProvider>

//  {/* Time Slot Headings in a Row */}
//  {/* <Box
//    display="flex"
//    justifyContent="space-between"
//    mt={3}
//    borderBottom={1}
//    borderColor="gray"
//    pb={1}
//  >
//    {Object.keys(timeOptions).map((heading) => (
//      <Typography
//        key={heading}
//        variant="body1"
//        fontWeight={selectedHeading === heading ? 700 : 400}
//        color={
//          selectedHeading === heading ? "primary" : "textSecondary"
//        }
//        sx={{ cursor: "pointer" }}
//        onClick={() => setSelectedHeading(heading)}
//      >
//        {heading}
//      </Typography>
//    ))}
//  </Box> */}

//  {/* Time Options Below */}
//  {/* <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
//    {timeOptions[selectedHeading].map((time) => (
//      <Typography
//        key={time}
//        variant="body2"
//        sx={{
//          cursor: "pointer",
//          p: 1,
//          borderRadius: 1,
//          bgcolor:
//            selectedTime === time ? "primary.light" : "transparent",
//        }}
//        onClick={() => setSelectedTime(time)}
//      >
//        {time}
//      </Typography>
//    ))}
//  </Box>
// </Card> */}
