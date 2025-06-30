import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import "./ViewVendorProfile.css";
import {
  getvendorProfileApi,
  updateVendorProfileApi,
} from "../../services/allApi";
import { IMG_BASE_URL } from "../../services/baseUrl";

function ViewVendorProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getvendorProfileApi();
        console.log("Fetched Profile Data:", response.data);

        if (response.status === 200 && response.data.vendor) {
          setProfile(response.data.vendor);
          
          setUpdatedProfile(response.data.vendor);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    console.log('profile',profile);

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const formData = new FormData();

    Object.keys(updatedProfile).forEach((key) => {
      if (key !== "images" && key !== "license" && key !== "storelogo") {
        formData.append(key, updatedProfile[key]);
      }
    });

    if (updatedProfile.license instanceof File) {
      formData.append("license", updatedProfile.license);
    }

    if (updatedProfile.storelogo instanceof File) {
      formData.append("storelogo", updatedProfile.storelogo);
    }

    updatedProfile.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    try {
      const response = await updateVendorProfileApi(formData);
      console.log("Edited profile response:", response);

      if (response.status === 200) {
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    setUpdatedProfile((prev) => ({ ...prev, license: file }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedProfile((prev) => {
        const newImages = [...prev.images];
        newImages[index] = file;
        return { ...prev, images: newImages };
      });
    }
  };

  if (loading) {
    return (
      <Container
        className="vendorprofile-container"
        style={{ height: "100vh" }}
      >
        <Card className="vendorprofile-card shadow ">
          <Spinner animation="border" variant="primary" role="status" />
          <h5 className="mt-3">Loading Profile...</h5>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="vendorprofile-container">
        <Card className="vendorprofile-card shadow">
          <h2 className="vendorprofile-header">Error</h2>
          <p className="text-danger">{error}</p>
          <Button
            className="vendorprofile-btn vendorprofile-btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="vendorprofile-container">
        <Card className="vendorprofile-card shadow">
          <h2 className="vendorprofile-header">No Profile Data Available</h2>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="vendorprofile-container">
      <Card className="vendorprofile-card shadow">
        <h2 className="vendorprofile-header">
          {isEditing ? "Edit Vendor Profile" : "Vendor Profile"}{" "}
        </h2>

        <div className="vendorprofile-logo-container">
          {isEditing ? (
            <Form.Control
              type="file"
              name="storelogo"
              accept="image/*"
              onChange={(e) =>
                setUpdatedProfile({
                  ...updatedProfile,
                  storelogo: e.target.files[0],
                })
              }
              className="vendorprofile-input"
            />
          ) : (
            <img
              src={
                profile.storelogo
                  ? `${IMG_BASE_URL}/uploads/${profile.storelogo}`
                  : "https://via.placeholder.com/150"
              }
              alt="Store Logo"
              className="vendorprofile-logo"
            />
          )}
        </div>

        <div className="vendorprofile-status-badge">
          <span
            className={
              profile.status === "Approved"
                ? "vendorprofile-status-approved"
                : "vendorprofile-status-pending"
            }
          >
            {profile.updateProfile}
          </span>
        </div>

        <div className="vendorprofile-section">
          <h3 className="vendorprofile-section-title">Personal Information</h3>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Owner Name
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="ownername"
                    value={updatedProfile.ownername}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">
                    {profile.ownername}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Email
                </Form.Label>

                {isEditing ? (
                  <Form.Control
                    type="email"
                    name="email"
                    value={updatedProfile.email || ""}
                    onChange={handleChange}
                    className="vendorprofile-field-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">{profile.email}</p>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Contact Number
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="number"
                    value={updatedProfile.number}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">{profile.number}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Role
                </Form.Label>
                <p className="vendorprofile-field-value">{profile.role}</p>
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="vendorprofile-section">
          <h3 className="vendorprofile-section-title">Business Information</h3>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Business Name
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="businessname"
                    value={updatedProfile.businessname}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">
                    {profile.businessname}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Store Type
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="storetype"
                    value={updatedProfile.storetype}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">
                    {profile.storetype}
                  </p>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Business License
                </Form.Label>
                {isEditing ? (
                  <div>
                    <Form.Control
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleLicenseChange}
                      className="vendorprofile-input"
                    />
                    {updatedProfile.license instanceof File && (
                      <p className="vendorprofile-field-value vendorprofile-link">
                        Current File:{" "}
                        <a
                          href={URL.createObjectURL(updatedProfile.license)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View License
                        </a>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="vendorprofile-field-value vendorprofile-link">
                    <a
                      href={`${IMG_BASE_URL}/uploads/${profile.license}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View License
                    </a>
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Description
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={updatedProfile.description}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">
                    {profile.description}
                  </p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  GST
                </Form.Label>
               
                  <p className="vendorprofile-field-value">
                    {profile.gstNumber}
                  </p>
              
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  ACCOUNT NUMBER
                </Form.Label>
              
                  <p className="vendorprofile-field-value">
                    {profile.accountNumber}
                  </p>
              
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  PAN
                </Form.Label>
             
                  <p className="vendorprofile-field-value">
                    {profile.panNumber}
                  </p>
               
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  IFSC
                </Form.Label>
              
                  <p className="vendorprofile-field-value">
                    {profile.ifscCode}
                  </p>
                
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="vendorprofile-section">
          <h3 className="vendorprofile-section-title">Location Details</h3>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Business Location
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="businesslocation"
                    value={updatedProfile.businesslocation}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">
                    {profile.businesslocation}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Landmark
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="businesslandmark"
                    value={updatedProfile.businesslandmark}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">
                    {profile.businesslandmark}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Address
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="address"
                    value={updatedProfile.address}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">{profile.address}</p>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  City
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="city"
                    value={updatedProfile.city}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">{profile.city}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  State
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="state"
                    value={updatedProfile.state}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">{profile.state}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="vendorprofile-field-label">
                  Pincode
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={updatedProfile.pincode}
                    onChange={handleChange}
                    className="vendorprofile-input"
                  />
                ) : (
                  <p className="vendorprofile-field-value">{profile.pincode}</p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label className="vendorprofile-field-label">
                Working Days
              </Form.Label>
              <p className="vendorprofile-field-value">
                {profile.workingDays?.join(", ") || "N/A"}
              </p>
            </Form.Group>
          </Row>
        </div>

        <div className="vendorprofile-section">
          <h3 className="vendorprofile-section-title">Store Images</h3>
          {isEditing ? (
            <div className="vendorprofile-store-images">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="vendorprofile-input"
              />
              <div className="vendorprofile-image-preview">
                {updatedProfile.images.map((image, index) =>
                  image instanceof File ? (
                    <img
                      key={index}
                      src={`${IMG_BASE_URL}/uploads/${image}`}
                      alt={`Preview ${index}`}
                    />
                  ) : null
                )}
              </div>
            </div>
          ) : (
            <div className="vendorprofile-store-images">
              {profile.images.map((image, index) => (
                <img
                  key={index}
                  src={`${IMG_BASE_URL}/uploads/${image}`}
                  alt={`Store ${index}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="vendorprofile-buttons">
          {isEditing ? (
            <>
              <Button
                className="vendorprofile-btn vendorprofile-btn-primary"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                className="vendorprofile-btn vendorprofile-btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="vendorprofile-btn vendorprofile-btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
}

export default ViewVendorProfile;
