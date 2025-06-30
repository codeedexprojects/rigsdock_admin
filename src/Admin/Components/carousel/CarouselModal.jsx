import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image, Row, Col, Alert } from "react-bootstrap";
import {  IMG_BASE_URL } from "../../../services/baseUrl";

const CarouselModal = ({ show, onHide, onSave, item }) => {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    image: null,
    imagePreview: "",
    isEditing: false
  });
  
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        link: item.link || "",
        image: null,
        imagePreview: item.image ? `${IMG_BASE_URL}/uploads/${item.image}` : "",
        isEditing: true,
        _id: item._id
      });
    } else {
      setFormData({ 
        title: "", 
        link: "", 
        image: null, 
        imagePreview: "",
        isEditing: false,
        _id: null
      });
    }
    setError("");
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file), 
      }));
      setError("");
    }
  };
  
  const handleSubmit = () => {
    // Basic validation
    if (!formData.title) {
      setError("Title is required");
      return;
    }
    
    if (!formData.link) {
      setError("Link is required");
      return;
    }
    
    // For edit operations, we need an image file since we can't change the backend
    if (formData.isEditing && !formData.image) {
      setError("Please select an image file again even when editing");
      return;
    }
    
    // For new items, image is required
    if (!formData.image) {
      setError("Image is required");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("link", formData.link);

    // Add ID for editing
    if (formData.isEditing && formData._id) {
      formDataObj.append("_id", formData._id);
    }

    // Add image file
    if (formData.image instanceof File) {
      formDataObj.append("image", formData.image);
    }

    onSave(formDataObj);
  };

  return (
    <Modal show={show} onHide={onHide} centered style={{ zIndex: "1234" }}>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">
          {formData.isEditing ? "Edit Carousel" : "Add Carousel"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter carousel title"
              className="p-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Link</Form.Label>
            <Form.Control
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter carousel link"
              className="p-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              {formData.isEditing ? (
                <span className="text-danger">Upload Image (Required even when editing)</span>
              ) : (
                "Upload Image"
              )}
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2"
              required
            />
            {formData.imagePreview && (
              <div className="mt-3 text-center">
                <Image
                  src={formData.imagePreview}
                  alt="Preview"
                  thumbnail
                  fluid
                  style={{
                    maxHeight: "200px",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>
            )}
            {formData.isEditing && !formData.image && (
              <div className="mt-2 text-danger">
                <small>* You must re-upload an image even when editing due to backend requirements</small>
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="px-4 py-3">
        <Row className="w-100">
          <Col xs={6}>
            <Button
              variant="outline-secondary"
              onClick={onHide}
              className="w-100 py-2"
            >
              Cancel
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="w-100 py-2"
            >
              {formData.isEditing ? "Save Changes" : "Add"}
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default CarouselModal;