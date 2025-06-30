import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import { PlusCircle, Edit2, Trash2, ExternalLink, Image } from "react-feather";
import { createVenorCarouselApi, deleteVendorCarouselApi, editVendorCarouselApi, getVendorCarouselApi } from "../../services/allApi";
import AddVendorCarousel from "./AddVendorCarousel";
import { BASE_URL, IMG_BASE_URL } from "../../services/baseUrl";

const ViewVendorCarousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCarousel = async () => {
      setIsLoading(true);
      try {
        const response = await getVendorCarouselApi();

        if (response.status === 200) {
          setCarouselItems(response.data);
        }
      } catch (error) {
        toast.error("Failed to load carousel items");
        console.error("Error fetching carousel items", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarousel();
  }, []);

  const handleSave = async (formData) => {
    try {
      let response;
      if (formData.get("_id")) {
        response = await editVendorCarouselApi(formData.get("_id"), formData);
      } else {
        response = await createVenorCarouselApi(formData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Carousel ${formData.get("_id") ? "updated" : "added"} successfully!`
        );
        setCarouselItems((prev) =>
          formData.get("_id")
            ? prev.map((d) =>
                d._id === formData.get("_id") ? response.data : d
              )
            : [...prev, response.data]
        );
      } else {
        toast.error("Failed to save carousel");
      }
    } catch (error) {
      console.error("Error saving carousel item:", error);
      toast.error("Something went wrong!");
    }

    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteVendorCarouselApi(id);

      if (response.success) {
        setCarouselItems(carouselItems.filter((item) => item._id !== id));
        toast.success("Carousel item removed successfully");
      } else {
        toast.error(response.error || "Failed to delete carousel item");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the item");
    }
  };

  return (
    <Container fluid className="carousel-admin-container p-4">
      <ToastContainer position="top-right" />

      <div className="admin-header">
        <Button
          variant="primary"
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={16} className="me-2" />
          Add New Slide
        </Button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading carousel items...</p>
        </div>
      ) : carouselItems.length > 0 ? (
        <div className="carousel-grid">
          {carouselItems.map((item) => (
            <div key={item._id} className="carousel-item-card">
              <div className="item-image-container">
                {item.image ? (
                  <img
                  src={item.image ? `${IMG_BASE_URL}/uploads/${item.image}` : "https://via.placeholder.com/150"}
                  alt={item.title}
                  className="item-image"
                />
                ) : (
                  <div className="no-image">
                    <Image size={40} />
                    <p>No image</p>
                  </div>
                )}
                <div className="item-actions">
                  <Button
                    variant="light"
                    className="action-btn edit-btn"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                    title="Edit slide"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="light"
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(item._id)}
                    title="Delete slide"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="item-details">
                <h4 className="item-title">{item.title}</h4>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item-link"
                  >
                    <ExternalLink size={14} className="me-1" />
                    View Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Image size={60} className="empty-icon" />
          <h3>No Carousel Items</h3>
          <p>Add your first carousel slide to get started</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <PlusCircle size={16} className="me-2" />
            Create First Slide
          </Button>
        </div>
      )}

      {showModal && (
        <AddVendorCarousel
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
          item={selectedItem}
        />
      )}
    </Container>
  );
};

export default ViewVendorCarousel;
