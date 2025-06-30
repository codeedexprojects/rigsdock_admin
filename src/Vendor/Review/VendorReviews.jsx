import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Grid,
  Chip,
  Divider,
  Avatar,
  Stack,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  getProductReviewsApi,
  reportReviewApi,
  respondToReviewApi,
} from "../../services/allApi";

const StyledModal = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
}));

const VendorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await getProductReviewsApi();
      console.log(response);

      if (response.data.success) {
        setReviews(response.data.reviews);
        setFilteredReviews(response.data.reviews);
      }
    } catch (err) {
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = reviews.filter((review) =>
      Object.values(review).some((value) =>
        typeof value === "string"
          ? value.toLowerCase().includes(term.toLowerCase())
          : (typeof value?.username === "string" &&
              value.username.toLowerCase().includes(term.toLowerCase())) ||
            (typeof value?.name === "string" &&
              value.name.toLowerCase().includes(term.toLowerCase()))
      )
    );
    setFilteredReviews(filtered);
  };

  const handleOpenModal = (type, review) => {
    setOpenModal(type);
    setCurrentReview(review);
    if (type === "response") setResponseText(review.response || "");
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setCurrentReview(null);
    setResponseText("");
    setReportReason("");
  };

  const handleSubmitResponse = async () => {
    try {
      console.log("Submitting response...");

      const response = await respondToReviewApi(
        currentReview._id,
        responseText
      );
      console.log("API Response:", response);

      if (response.success && response.status === 200) {
        setReviews(
          reviews.map((rev) =>
            rev._id === currentReview._id
              ? { ...rev, response: responseText }
              : rev
          )
        );
        handleCloseModal();
        fetchReviews();
      } else {
        setError(response.error || "Failed to submit response");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setError("Failed to submit response");
    }
  };

  const handleSubmitReport = async () => {
    try {
      const response = await reportReviewApi(currentReview._id, reportReason);
      console.log(response);

      if (response.data.success) {
        setReviews(
          reviews.map((rev) =>
            rev._id === currentReview._id
              ? { ...rev, response: reportReason }
              : rev
          )
        );
        handleCloseModal();
      }
    } catch (err) {
      setError("Failed to submit report");
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Product Reviews Management
      </Typography>

      <TextField
        fullWidth
        label="Search reviews..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: <i className="fas fa-search" />,
        }}
      />

      {filteredReviews.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
          No reviews found
        </Typography>
      ) : (
        filteredReviews.map((review) => (
          <ReviewCard key={review._id}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>
                      {review.user && review.user.username
                        ? review.user.username.charAt(0).toUpperCase()
                        : review.user.email.charAt(0).toUpperCase()}
                    </Avatar>

                    <div>
                      <Typography variant="subtitle1">
                        {review.user && review.user.username
                          ? review.user.username
                          : review.user.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.user && review.user.email}
                      </Typography>
                    </div>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Product: {review.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={`Rating: ${review.rating}/5`}
                    color="primary"
                    size="small"
                    sx={{ mt: 1, mr: 1 }}
                  />
                  {review.report?.status && (
                    <Box
                      sx={{
                        backgroundColor: "#fff3e0",
                        p: 1,
                        borderRadius: 1,
                        mt: 1,
                        border: "1px solid #ff9800",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="error"
                      >
                        Report Status: {review.report.status}
                      </Typography>

                      {review.report.reason && (
                        <Typography variant="body2" color="text.secondary">
                          Reason: {review.report.reason}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    sx={{ borderLeft: { md: "1px solid #ddd" }, pl: { md: 2 } }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      Customer Review
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {review.review}
                    </Typography>

                    {review.response ? (
                      <Box
                        sx={{
                          backgroundColor: "#f8f9fa",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Your Response:
                        </Typography>
                        <Typography variant="body2">
                          {review.response}
                        </Typography>
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenModal("response", review)}
                        sx={{ mr: 1 }}
                      >
                        Add Response
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleOpenModal("report", review)}
                      disabled={review.report?.reason}
                    >
                      {!review.report?.status ? "Reported" : "Report Review"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </ReviewCard>
        ))
      )}

      <Modal open={openModal === "response"} onClose={handleCloseModal}>
        <StyledModal>
          <Typography variant="h6" gutterBottom>
            Respond to Review
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSubmitResponse}
              disabled={!responseText.trim()}
            >
              Submit Response
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Stack>
        </StyledModal>
      </Modal>

      <Modal open={openModal === "report"} onClose={handleCloseModal}>
        <StyledModal>
          <Typography variant="h6" gutterBottom>
            Report Inappropriate Content
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Reporting review for: {currentReview?.product.name}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Please specify the reason for reporting..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmitReport}
              disabled={!reportReason.trim()}
            >
              Submit Report
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Stack>
        </StyledModal>
      </Modal>
    </Box>
  );
};

export default VendorReviews;
