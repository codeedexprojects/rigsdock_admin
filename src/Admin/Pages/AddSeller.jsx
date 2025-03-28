import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Input,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import { createSellerApi } from "../../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Container = styled(Paper)({
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "900px",
  margin: "auto",
  marginTop: "20px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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

const ChangeButton = styled(IconButton)({
  position: "absolute",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
});

const AddSeller = () => {
  const [formData, setFormData] = useState({
    ownername: "",
    email: "",
    businessname: "",
    businesslocation: "",
    businesslandmark: "",
    number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
    storetype: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [storeLogo, setStoreLogo] = useState(null);
  const [license, setLicense] = useState(null);
  const [images, setImages] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [error, setError] = useState(null);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "ownername":
        error = value ? "" : "Owner name is required";
        break;
      case "email":
        error = /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email address";
        break;
      case "number":
        error = /^\d{10}$/.test(value) ? "" : "Invalid phone number";
        break;
      case "password":
        error =
          value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      case "pincode":
        error = /^\d{6}$/.test(value)
          ? ""
          : "Invalid pincode (must be 6 digits)";
        break;
      default:
        error = value ? "" : "This field is required";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  useEffect(() => {
    const fetchIndianStates = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        console.log("all", data);

        const india = data.find((country) => country.cca3 === "IND");
        console.log("states", india);

        if (india) {
          setStates(india.subdivisions);
          console.log("indianstates", states);
        } else {
          setStates([]);
        }
      } catch (err) {
        setError("Failed to fetch states");
      } finally {
        setLoading(false);
      }
    };

    fetchIndianStates();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateFiles = () => {
    const newErrors = {};
    if (!storeLogo) newErrors.storeLogo = "Store logo is required";
    if (!license) newErrors.license = "License is required";
    if (images.length === 0)
      newErrors.images = "At least one store image is required";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e, setter, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fieldName === "license") {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("License must be PDF, DOC, DOCX, JPG, or JPEG");
        return;
      }
    }

    setter(file);
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formErrors = Object.keys(formData).reduce((acc, key) => {
      if (!formData[key]) acc[key] = "This field is required";
      return acc;
    }, {});

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0 || !validateFiles()) return;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value)
    );
    formDataToSend.append("storelogo", storeLogo);
    formDataToSend.append("license", license);
    images.forEach((img) => formDataToSend.append("images", img));

    try {
      const response = await createSellerApi(formDataToSend);

      if (response.status === 201) {
        toast.success("Seller added successfully!");
        setTimeout(() => {
          navigate("/seller");
        }, 1500);
      } else if (response.status === 409) {
        toast.error("Email or phone already exists");
      } else {
        toast.error("Failed to add seller");
      }
    } catch (error) {
      toast.error("Error adding seller");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Add Seller
        </Typography>
      </Box>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={4}>
          <ProfileSection>
            <ProfileImage
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : "https://via.placeholder.com/120"
              }
            />
            <input
              accept="image/*"
              id="profile-image"
              type="file"
              hidden
              onChange={(e) =>
                handleFileChange(e, setProfileImage, "profileImage")
              }
            />
            <label htmlFor="profile-image">
              <ChangeButton component="span">
                <PhotoCameraIcon />
              </ChangeButton>
            </label>
          </ProfileSection>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[
              { label: "Owner Name", name: "ownername", required: true },
              { label: "Email", name: "email", type: "email", required: true },
              { label: "Business Name", name: "businessname", required: true },
              { label: "Business Location", name: "businesslocation" },
              { label: "Business Landmark", name: "businesslandmark" },
              {
                label: "Phone No",
                name: "number",
                type: "tel",
                required: true,
              },
              { label: "Address", name: "address", required: true },
              { label: "City", name: "city", required: true },
              { label: "State", name: "state", required: true },
              { label: "Pincode", name: "pincode", required: true },
              { label: "Description", name: "description", multiline: true },
              { label: "Store Type", name: "storetype", required: true },
              {
                label: "Password",
                name: "password",
                type: "password",
                required: true,
              },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  multiline={field.multiline}
                  onBlur={(e) => validateField(field.name, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Upload Documents
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.storeLogo}>
              <InputLabel shrink>Store Logo *</InputLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setStoreLogo, "storeLogo")}
                inputProps={{ "aria-label": "Store Logo" }}
              />
              {storeLogo && (
                <Chip
                  label={storeLogo.name}
                  onDelete={() => setStoreLogo(null)}
                  sx={{ mt: 1 }}
                />
              )}
              {errors.storeLogo && (
                <Typography color="error" variant="caption">
                  {errors.storeLogo}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.license}>
              <InputLabel shrink>License *</InputLabel>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, setLicense, "license")}
                inputProps={{ "aria-label": "License" }}
              />
              {license && (
                <Chip
                  label={license.name}
                  onDelete={() => setLicense(null)}
                  sx={{ mt: 1 }}
                />
              )}
              {errors.license && (
                <Typography color="error" variant="caption">
                  {errors.license}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.images}>
              <InputLabel shrink>Store Images *</InputLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFiles}
                inputProps={{ "aria-label": "Store Images" }}
              />
              <Box sx={{ mt: 1 }}>
                {images.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              {errors.images && (
                <Typography color="error" variant="caption">
                  {errors.images}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "5px",
        }}
      >
        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Container>
  );
};

export default AddSeller;
