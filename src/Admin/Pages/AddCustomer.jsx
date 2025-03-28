import React, { useState } from "react";
import { 
  Box, Typography, TextField, Button, Grid, Avatar, CircularProgress 
} from "@mui/material";
import { styled } from "@mui/system";
import { createcustomerApi } from "../../services/allApi";
import { toast } from "react-toastify";

const Container = styled(Box)({
  background: "#F8FBF8",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "900px",
  margin: "auto",
});

const ProfileSection = styled(Box)({
  textAlign: "center",
  position: "relative",
});

const ProfileImage = styled(Avatar)({
  width: "120px",
  height: "120px",
  margin: "10px auto",
  cursor: "pointer",
});

const ChangeButton = styled(Button)({
  position: "absolute",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  fontSize: "12px",
  textTransform: "none",
});

const AddCustomer = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNo: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await createcustomerApi(formData);
      if (response.status === 201) {
        toast.success("Customer added successfully!");
        setFormData({
          firstName: "",
          secondName: "",
          lastName: "",
          username: "",
          email: "",
          phoneNo: "",
        });
        setProfileImage(null);
      } else {
        toast.error("Failed to add customer.");
      }
    } catch (error) {
      toast.error("Error adding customer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Add Customer
      </Typography>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <ProfileSection>
            <ProfileImage 
              src={profileImage || "https://via.placeholder.com/120"} 
              alt="Profile"
            />
            <input 
              type="file" 
              accept="image/*" 
              id="upload-image"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <ChangeButton component="span" variant="contained">
                Change
              </ChangeButton>
            </label>
          </ProfileSection>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            {[
              { label: "FIRST NAME", name: "firstName" },
              { label: "SECOND NAME", name: "secondName" },
              { label: "LAST NAME", name: "lastName" },
              { label: "USERNAME", name: "username" },
              { label: "EMAIL", name: "email" },
              { label: "PHONE NO", name: "phoneNo" },
            ].map(({ label, name }) => (
              <Grid item xs={4} key={name}>
                <Typography color="primary" fontSize="14px">{label}</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box mt={3} textAlign="right">
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={isLoading ? <CircularProgress size={20} /> : "➕"}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </Box>
    </Container>
  );
};

export default AddCustomer;
