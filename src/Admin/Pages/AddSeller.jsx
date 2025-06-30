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
  Divider,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorIcon from "@mui/icons-material/Error";
import {
  createSellerApi,
  verifyAccountApi,
  verifyGstApi,
  verifyPanApi,
} from "../../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

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

const SectionTitle = styled(Typography)({
  fontWeight: "600",
  marginTop: "20px",
  marginBottom: "10px",
});

const VerificationButton = styled(Button)({
  marginLeft: "10px",
  height: "40px",
});

const VerificationStatus = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "5px",
});

const AddSeller = () => {
  const [formData, setFormData] = useState({
    ownername: "",
    email: "",
    accountNumber: "",
    ifscCode: "",
    gstNumber: "",
    panNumber: "",
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
    country: "",
    openingTime: "12:00 AM",
    closingTime: "12:00 AM",
    workingDays: [],
    isGstVerified: false,
    isPanVerified: false,
    isBankVerified: false,
  });

  const [errors, setErrors] = useState({});
  const [storeLogo, setStoreLogo] = useState(null);
  const [license, setLicense] = useState(null);
  const [images, setImages] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [passbookPhoto, setPassbookPhoto] = useState(null);

  const [loading, setLoading] = useState(false);
  const [verifyingGst, setVerifyingGst] = useState(false);
  const [verifyingPan, setVerifyingPan] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [accountholdername, setaccountholdername] = useState("false");

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
      case "accountNumber":
        error = /^\d{9,18}$/.test(value)
          ? ""
          : "Invalid account number (must be 9-18 digits)";
        break;
      case "ifscCode":
        error = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
          ? ""
          : "Invalid IFSC code format";
        break;
      case "gstNumber":
        error = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(
          value
        )
          ? ""
          : "Invalid GST number format";
        break;
      case "panNumber":
        error = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
          ? ""
          : "Invalid PAN number format";
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

        const india = data.find((country) => country.cca3 === "IND");

        if (india) {
          setStates(india.subdivisions);
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
    if (!passbookPhoto) newErrors.passbookPhoto = "Passbook photo is required";
    if (images.length === 0)
      newErrors.images = "At least one store image is required";

    // Verify that required verifications are done
    if (formData.gstNumber && !formData.isGstVerified)
      newErrors.gstVerification = "GST number must be verified";
    if (formData.panNumber && !formData.isPanVerified)
      newErrors.panVerification = "PAN number must be verified";
    if (formData.accountNumber && !formData.isBankVerified)
      newErrors.bankVerification = "Bank account must be verified";

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleWorkingDaysChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedDays = checked
        ? [...prevState.workingDays, value]
        : prevState.workingDays.filter((day) => day !== value);

      return {
        ...prevState,
        workingDays: updatedDays,
      };
    });

    if (errors.workingDays) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.workingDays;
        return newErrors;
      });
    }
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

    if (fieldName === "passbookPhoto") {
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedImageTypes.includes(file.type)) {
        toast.error("Passbook photo must be JPG, JPEG, or PNG");
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

  const verifyGst = async () => {
    if (!formData.gstNumber) {
      setErrors((prev) => ({
        ...prev,
        gstNumber: "GST number is required for verification",
      }));
      return;
    }

    setVerifyingGst(true);
    try {
      const response = await verifyGstApi(formData.gstNumber);

      if (response.status === 200) {
        setFormData((prev) => ({ ...prev, isGstVerified: true }));
        toast.success("GST number verified successfully!");
      } else {
        toast.error("GST verification failed");
      }
    } catch (error) {
      toast.error("Error verifying GST number");
    } finally {
      setVerifyingGst(false);
    }
  };

  // Fix for verifyPan function
  const verifyPan = async () => {
    if (!formData.panNumber) {
      setErrors((prev) => ({
        ...prev,
        panNumber: "PAN number is required for verification",
      }));
      return;
    }

    setVerifyingPan(true);
    try {
      // Fix: Send the panNumber directly as a query parameter
      const response = await verifyPanApi(formData.panNumber);

      if (response.status === 200) {
        setFormData((prev) => ({ ...prev, isPanVerified: true }));
        toast.success("PAN number verified successfully!");
      } else {
        toast.error("PAN verification failed");
      }
    } catch (error) {
      toast.error("Error verifying PAN number");
    } finally {
      setVerifyingPan(false);
    }
  };

  // Fix for verifyBankAccount function
  const verifyBankAccount = async () => {
    if (!formData.accountNumber || !formData.ifscCode) {
      setErrors((prev) => ({
        ...prev,
        accountNumber: !formData.accountNumber
          ? "Account number is required"
          : "",
        ifscCode: !formData.ifscCode ? "IFSC code is required" : "",
      }));
      return;
    }

    setVerifyingBank(true);
    try {
      // Fix: Send the parameters directly in the query string
      const response = await verifyAccountApi(
        formData.accountNumber,
        formData.ifscCode
      );

      if (response.status === 200) {
        setFormData((prev) => ({ ...prev, isBankVerified: true }));
        setaccountholdername(response.data.name_at_bank)
        toast.success("Bank account verified successfully!");
      } else {
        toast.error("Bank account verification failed");
      }
    } catch (error) {
      toast.error("Error verifying bank account");
    } finally {
      setVerifyingBank(false);
    }
  };

const handleSubmit = async () => {
  const formErrors = Object.keys(formData).reduce((acc, key) => {
    // Only validate required fields
    const requiredFields = [
      "ownername",
      "email",
      "businessname",
      "number",
      "address",
      "city",
      "state",
      "pincode",
      "storetype",
      "password",
      "country",
    ];
    if (requiredFields.includes(key) && !formData[key]) {
      acc[key] = "This field is required";
    }
    return acc;
  }, {});

  setErrors(formErrors);
  if (Object.keys(formErrors).length > 0 || !validateFiles()) return;
  setLoading(true);

  const formDataToSend = new FormData();
  
  // Handle all form data except workingDays
  Object.entries(formData).forEach(([key, value]) => {
    if (key === "workingDays") {
      // For workingDays, append each day as a separate entry with the same key
      value.forEach(day => {
        formDataToSend.append("workingDays", day);
      });
    } else if (Array.isArray(value)) {
      formDataToSend.append(key, JSON.stringify(value));
    } else {
      formDataToSend.append(key, value);
    }
  });

  formDataToSend.append("storelogo", storeLogo);
  formDataToSend.append("license", license);
  formDataToSend.append("passbookPhoto", passbookPhoto);

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
    console.error("Error details:", error);
    toast.error("Error adding seller");
  } finally {
    setLoading(false);
  }
};


  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const generateTimeOptions = () => {
    const options = [];
    const periods = ["AM", "PM"];

    [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((hour) => {
      ["00", "30"].forEach((minute) => {
        periods.forEach((period) => {
          // Skip invalid combinations (like 12:30 AM is valid, 12:30 PM is valid)
          if (!(hour === 12 && period === "PM")) {
            options.push(`${hour}:${minute} ${period}`);
          }
        });
      });
    });

    return options.sort((a, b) => {
      // Proper sorting for time values
      const timeToMinutes = (time) => {
        const [hours, minutes, period] = time
          .match(/(\d+):(\d+) (\w+)/)
          .slice(1);
        let total = parseInt(hours) * 60 + parseInt(minutes);
        if (period === "PM" && hours !== "12") total += 12 * 60;
        if (period === "AM" && hours === "12") total -= 12 * 60;
        return total;
      };
      return timeToMinutes(a) - timeToMinutes(b);
    });
  };

  const timeOptions = generateTimeOptions();

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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Owner Name"
                name="ownername"
                value={formData.ownername}
                onChange={handleInputChange}
                error={!!errors.ownername}
                helperText={errors.ownername}
                required
                onBlur={(e) => validateField("ownername", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                onBlur={(e) => validateField("email", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Business Name"
                name="businessname"
                value={formData.businessname}
                onChange={handleInputChange}
                error={!!errors.businessname}
                helperText={errors.businessname}
                required
                onBlur={(e) => validateField("businessname", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Phone No"
                name="number"
                type="tel"
                value={formData.number}
                onChange={handleInputChange}
                error={!!errors.number}
                helperText={errors.number}
                required
                onBlur={(e) => validateField("number", e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Verification Section */}
      <Divider sx={{ my: 3 }} />
      <SectionTitle variant="h6">Verification Details</SectionTitle>
      <Grid container spacing={3}>
        {/* GST Verification */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="GST Number "
              required
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber}
              onBlur={(e) => validateField("gstNumber", e.target.value)}
              disabled={formData.isGstVerified}
              InputProps={{
                endAdornment: formData.isGstVerified && (
                  <InputAdornment position="end">
                    <VerifiedIcon color="success" />
                  </InputAdornment>
                ),
              }}
            />
            <VerificationButton
              variant="contained"
              color={formData.isGstVerified ? "success" : "primary"}
              onClick={verifyGst}
              disabled={
                !formData.gstNumber || verifyingGst || formData.isGstVerified
              }
            >
              {verifyingGst ? (
                <CircularProgress size={24} color="inherit" />
              ) : formData.isGstVerified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </VerificationButton>
          </Box>
          {errors.gstVerification && (
            <VerificationStatus>
              <ErrorIcon color="error" fontSize="small" />
              <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                {errors.gstVerification}
              </Typography>
            </VerificationStatus>
          )}
        </Grid>

        {/* PAN Verification */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="PAN Number "
              required
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              error={!!errors.panNumber}
              helperText={errors.panNumber}
              onBlur={(e) => validateField("panNumber", e.target.value)}
              disabled={formData.isPanVerified}
              InputProps={{
                endAdornment: formData.isPanVerified && (
                  <InputAdornment position="end">
                    <VerifiedIcon color="success" />
                  </InputAdornment>
                ),
              }}
            />
            <VerificationButton
              variant="contained"
              color={formData.isPanVerified ? "success" : "primary"}
              onClick={verifyPan}
              disabled={
                !formData.panNumber || verifyingPan || formData.isPanVerified
              }
            >
              {verifyingPan ? (
                <CircularProgress size={24} color="inherit" />
              ) : formData.isPanVerified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </VerificationButton>
          </Box>
          {errors.panVerification && (
            <VerificationStatus>
              <ErrorIcon color="error" fontSize="small" />
              <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                {errors.panVerification}
              </Typography>
            </VerificationStatus>
          )}
        </Grid>

        {/* Bank Account Verification */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber}
            required
            onBlur={(e) => validateField("accountNumber", e.target.value)}
            disabled={formData.isBankVerified}
            InputProps={{
              endAdornment: formData.isBankVerified && (
                <InputAdornment position="end">
                  <VerifiedIcon color="success" />
                </InputAdornment>
              ),
            }}
          />
          {accountholdername && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, ml: 1 }}>
              Account Holder: <strong>{accountholdername}</strong>
            </Typography>
          )}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              error={!!errors.ifscCode}
              helperText={errors.ifscCode}
              required
              onBlur={(e) => validateField("ifscCode", e.target.value)}
              disabled={formData.isBankVerified}
            />
            <VerificationButton
              variant="contained"
              color={formData.isBankVerified ? "success" : "primary"}
              onClick={verifyBankAccount}
              disabled={
                !formData.accountNumber ||
                !formData.ifscCode ||
                verifyingBank ||
                formData.isBankVerified
              }
            >
              {verifyingBank ? (
                <CircularProgress size={24} color="inherit" />
              ) : formData.isBankVerified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </VerificationButton>
          </Box>
          {errors.bankVerification && (
            <VerificationStatus>
              <ErrorIcon color="error" fontSize="small" />
              <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                {errors.bankVerification}
              </Typography>
            </VerificationStatus>
          )}
        </Grid>

        {/* Bank Passbook Upload */}
        <Grid item xs={12} sm={6}>
          <input
            accept="image/jpeg,image/jpg,image/png"
            style={{ display: "none" }}
            id="passbook-upload"
            type="file"
            onChange={(e) =>
              handleFileChange(e, setPassbookPhoto, "passbookPhoto")
            }
          />
          <label htmlFor="passbook-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              style={{ textTransform: "none" }}
            >
              Upload Bank Passbook*
            </Button>
          </label>
          {passbookPhoto && (
            <Typography variant="caption" display="block">
              {passbookPhoto.name}
            </Typography>
          )}
          {errors.passbookPhoto && (
            <Typography color="error" variant="caption" display="block">
              {errors.passbookPhoto}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Business Details Section */}
      <Divider sx={{ my: 3 }} />
      <SectionTitle variant="h6">Business Details</SectionTitle>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Business Location"
            name="businesslocation"
            value={formData.businesslocation}
            onChange={handleInputChange}
            error={!!errors.businesslocation}
            helperText={errors.businesslocation}
            onBlur={(e) => validateField("businesslocation", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Business Landmark"
            name="businesslandmark"
            value={formData.businesslandmark}
            onChange={handleInputChange}
            error={!!errors.businesslandmark}
            helperText={errors.businesslandmark}
            onBlur={(e) => validateField("businesslandmark", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={!!errors.address}
            helperText={errors.address}
            required
            onBlur={(e) => validateField("address", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            error={!!errors.country}
            helperText={errors.country}
            required
            onBlur={(e) => validateField("country", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            error={!!errors.city}
            helperText={errors.city}
            required
            onBlur={(e) => validateField("city", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="State"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            error={!!errors.state}
            helperText={errors.state}
            required
            onBlur={(e) => validateField("state", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            error={!!errors.pincode}
            helperText={errors.pincode}
            required
            onBlur={(e) => validateField("pincode", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Store Type"
            name="storetype"
            value={formData.storetype}
            onChange={handleInputChange}
            error={!!errors.storetype}
            helperText={errors.storetype}
            required
            onBlur={(e) => validateField("storetype", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            onBlur={(e) => validateField("password", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={timeOptions}
            value={formData.openingTime}
            onChange={(_, newValue) => {
              handleInputChange({
                target: {
                  name: "openingTime",
                  value: newValue,
                },
              });
            }}
            onInputChange={(_, newInputValue) => {
              handleInputChange({
                target: {
                  name: "openingTime",
                  value: newInputValue,
                },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                size="small"
                label="Opening Time"
                error={!!errors.openingTime}
                helperText={errors.openingTime}
                required
                onBlur={() =>
                  validateField("openingTime", formData.openingTime)
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={timeOptions}
            value={formData.closingTime}
            onChange={(_, newValue) => {
              handleInputChange({
                target: {
                  name: "closingTime",
                  value: newValue,
                },
              });
            }}
            onInputChange={(_, newInputValue) => {
              handleInputChange({
                target: {
                  name: "closingTime",
                  value: newInputValue,
                },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                size="small"
                label="Closing Time"
                error={!!errors.closingTime}
                helperText={errors.closingTime}
                required
                onBlur={() =>
                  validateField("closingTime", formData.closingTime)
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            onBlur={(e) => validateField("description", e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Working Days Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Working Days
        </Typography>
        <Grid container spacing={1}>
          {weekdays.map((day) => (
            <Grid item key={day}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id={`day-${day.toLowerCase()}`}
                  value={day}
                  checked={formData.workingDays.includes(day)}
                  onChange={handleWorkingDaysChange}
                />
                <label
                  htmlFor={`day-${day.toLowerCase()}`}
                  style={{ marginLeft: 8 }}
                >
                  {day}
                </label>
              </Box>
            </Grid>
          ))}
        </Grid>
        {errors.workingDays && (
          <Typography color="error" variant="caption">
            {errors.workingDays}
          </Typography>
        )}
      </Box>

      {/* Document Upload Section */}
      <Divider sx={{ my: 3 }} />
      <SectionTitle variant="h6">Upload Documents</SectionTitle>
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

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
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
          size="large"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Container>
  );
};

export default AddSeller;
