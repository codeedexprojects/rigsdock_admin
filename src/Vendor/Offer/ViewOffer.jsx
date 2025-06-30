import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Box,
  Stack,
  Grid,
  Container,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import OfferModal from "./OfferModal";
import { deleteVendorOfferApi, getVendorOfferApi } from "../../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";

function ViewOffer() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await getVendorOfferApi();
      console.log(response);

      if (response?.data) {
        setOffers(response.data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openModal, setOpenModal] = useState({ open: false, mode: "add" });

  const handleEdit = (offer) => {
    console.log("Editing offer:", offer);
    setSelectedOffer(offer); // Set the selected offer first
    setOpenModal({ open: true, mode: "edit" });
  };

  const handleDelete = (offer) => {
    setSelectedOffer(offer);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedOffer) return;

    try {
      await deleteVendorOfferApi(selectedOffer._id);
      setOffers(offers.filter((offer) => offer._id !== selectedOffer.id));
      fetchOffers();
      toast.success("Offer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete offer");
    } finally {
      setOpenDelete(false);
      setSelectedOffer(null);
    }
  };

  const handleAddOffer = () => {
    setSelectedOffer(null);
    setOpenModal({ open: true, mode: "add" });
  };

  const handleSaveOffer = (updatedOffer) => {
    setOffers((prevOffers) => {
      if (openModal.mode === "add") {
        return [
          ...prevOffers,
          {
            ...updatedOffer,
            id:
              prevOffers.length > 0
                ? Math.max(...prevOffers.map((o) => o.id)) + 1
                : 1,
          },
        ];
      } else {
        return prevOffers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        );
      }
    });

    setOpenModal({ open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Promotional Offers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddOffer}
        >
          Add New Offer
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      ) : offers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No offers available
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddOffer}
            sx={{ mt: 2 }}
          >
            Create Your First Offer
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {offers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 2,
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="h6" noWrap title={offer.name}>
                      {offer.name}
                    </Typography>
                  }
                  action={
                    <Chip
                      label={offer.status}
                      color={offer.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  }
                />
                <Divider />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {offer.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Discount: {offer.discountValue}{" "}
                      {offer.discountType === "percentage" ? "%" : "USD"}
                    </Typography>
                    <Typography variant="body2">
                      Valid: {dayjs(offer.validFrom).format("DD MMM YYYY")} to{" "}
                      {dayjs(offer.validTo).format("DD MMM YYYY")}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Applicable Products:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    {offer.products.map((product, index) => (
                      <Chip key={index} label={product} size="small" />
                    ))}
                  </Stack>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(offer)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(offer)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the offer "{selectedOffer?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <OfferModal
        open={openModal.open}
        onClose={() => setOpenModal({ open: false })}
        mode={openModal.mode}
        offer={selectedOffer}
        setOffer={setSelectedOffer}
        onSave={handleSaveOffer}
      />
      <ToastContainer></ToastContainer>
    </Container>
  );
}

export default ViewOffer;
