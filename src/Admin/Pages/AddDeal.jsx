import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./adddeal.css";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

function AddDeal() {
  const [selectedFromSlot, setSelectedFromSlot] = useState("Morning");
  const [selectedToSlot, setSelectedToSlot] = useState("Morning");
  const [selectedDate, setSelectedDate] = useState(null);

  const timeMapping = {
    Morning: ["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM"],
    Noon: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"],
    Evening: ["04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"],
    Night: ["08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"],
  };

  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-3">
        <Col>
          <p className="add-deal-title ">Deal Of The Day</p>
        </Col>
        <Col className="text-end">
          <button className="schedule-button">Scheduled</button>
        </Col>
      </Row>

      <Row>
        <Col md={5}>
          <h5 className="text-center mb-3 add-deal-subtitle">
            Select Date and Time Slot
          </h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="deal-name-label">Select Date</Form.Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  views={["year", "month", "day"]}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Form.Group>

            <h6 className="text-center add-deal-subtitle">From</h6>
            <div className="time-slot-container">
              {Object.keys(timeMapping).map((slot) => (
                <div
                  key={slot}
                  className={`time-slot-label deal-name-label ${
                    selectedFromSlot === slot ? "active" : ""
                  }`}
                  onClick={() => setSelectedFromSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>

            <Row className="mb-3">
              {timeMapping[selectedFromSlot].map((time, index) => (
                <Col key={index} md={3} className="time-slot mt-2">
                  {time}
                </Col> 
              ))}
            </Row>

            <h6 className="text-center add-deal-subtitle">To</h6>
            <div className="time-slot-container">
              {Object.keys(timeMapping).map((slot) => (
                <div
                  key={slot}
                  className={`time-slot-label deal-name-label ${
                    selectedFromSlot === slot ? "active" : ""
                  }`}
                  onClick={() => setSelectedFromSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>

            <Row className="mb-3">
              {timeMapping[selectedToSlot].map((time, index) => (
                <Col key={index} md={3} className="time-slot mt-2">
                  {time}
                </Col>
              ))}
            </Row>
          </Form>
        </Col>

        <Col md={7}>
          <div className="d-flex align-items-start mb-3">
            <div className="deal-image-container">
              <img
                src={image || "your-placeholder-image.jpg"}
                alt="Deal"
                className="deal-image"
              />
              <label className="edit-icon">
                <i className="fas fa-camera"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            </div>
            <div className="ms-3 flex-grow-1">
              <Form.Group className="mb-3">
                <Form.Label className="deal-name-label">
                  Enter Deal Name
                </Form.Label>
                <Form.Control type="text" placeholder="Enter Deal Name..." />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="deal-content-label">
                  Enter Contents
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Contents..."
                />
              </Form.Group>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <Form.Select className="deal-dropdown">
              <option>Select User</option>
              <option>User 1</option>
              <option>User 2</option>
            </Form.Select>
            <Form.Select className="deal-dropdown">
              <option>Select Product</option>
              <option>Product 1</option>
              <option>Product 2</option>
            </Form.Select>
            <Form.Select className="deal-dropdown">
              <option>Select Category</option>
              <option>Category 1</option>
              <option>Category 2</option>
            </Form.Select>
          </div>

          <button className="w-25 mb-4 publish-button ">Publish</button>

          <h5 className="add-deal-subtitle">Past Deals</h5>
          <Form.Control
            type="text"
            placeholder="Search Deals..."
            className="mb-3"
          />
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Item 1 <span className="text-danger">ENDED</span>
              <Button variant="info" size="sm">
                Check Details
              </Button>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Item 2 <span className="text-danger">ENDED</span>
              <Button variant="info" size="sm">
                Check Details
              </Button>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default AddDeal;
