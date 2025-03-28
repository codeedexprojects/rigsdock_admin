import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddDealvendor.css";
import {
  createvendorDealOftheDayApi,
  getvendorproductsApi,
} from "../../services/allApi";
import { toast, ToastContainer } from "react-toastify";

function AddDealOfTheDay() {
  const [formData, setFormData] = useState({
    productId: "",
    offerPrice: "",
    expiresAt: new Date(),
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getvendorproductsApi();
        if (response.status === 200) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.productId || !formData.offerPrice) {
      toast.warning("Please select a product and enter an offer price.");
      return;
    }
  
    const offerPrice = parseFloat(formData.offerPrice);
    if (isNaN(offerPrice)) {
      toast.error("Please enter a valid offer price.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await createvendorDealOftheDayApi({
        productId: formData.productId,
        offerPrice: offerPrice,
      });
  
      if (response.status === 201) {
        toast.success("Deal created successfully!");
        setFormData({
          productId: "",
          offerPrice: "",
        });
      }
    } catch (error) {
      console.error("Error creating deal:", error);
  
      if (error.response?.status === 400) {
        toast.warning("You already have an active deal");
      } else if (error.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  const selectedProduct = products.find((p) => p._id === formData.productId);

  return (
    <Container className="deal-container">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card className="deal-card border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="deal-title gradient-text mb-2">
                  Create New Deal
                </h2>
                <p className="text-muted mb-0">
                  Boost your sales with time-limited offers
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4 form-group-custom">
                  <Form.Label className="deal-label">Select Product</Form.Label>
                  <Form.Select
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    className="form-control-lg border-2"
                  >
                    <option value="">Choose product...</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ₹{product.price}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4 form-group-custom offer-price-group">
                  <Form.Label className="deal-label">Offer Price</Form.Label>
                  <div className="input-group custom-input-group">
                    <span className="input-group-text custom-input-icon">
                      ₹
                    </span>
                    <Form.Control
                      type="number"
                      placeholder="Enter offer price"
                      value={formData.offerPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, offerPrice: e.target.value })
                      }
                      className="form-control-lg custom-input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </Form.Group>

                <Card className="preview-card mb-4 border-0">
                  <Card.Body>
                    <h6 className="text-white mb-3">Deal Preview</h6>
                    <div className="d-flex justify-content-between text-white">
                      <div>
                        <small className="opacity-75">Product</small>
                        <div className="fw-medium">
                          {selectedProduct?.name || "N/A"}
                        </div>
                      </div>
                      <div>
                        <small className="opacity-75">Offer Price</small>
                        <div className="fw-medium">
                          ₹{formData.offerPrice || "0.00"}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 btn-lg submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Deal"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default AddDealOfTheDay;









// {/* <div>
//                       <small className="opacity-75">Expires</small>
//                       <div className="fw-medium">
//                         {formData.expiresAt?.toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         }) || "N/A"}
//                       </div>
//                     </div> */}

// {/* <Form.Group className="mb-4 form-group-custom expiry-date-group">
//           <Form.Label className="deal-label">
//             Expiration Date & Time
//           </Form.Label>
//           <div className="custom-input-group">
//             <span className="custom-input-icon">📅</span>
//             <DatePicker
//               selected={formData.expiresAt}
//               onChange={(date) =>
//                 setFormData({ ...formData, expiresAt: date })
//               }
//               showTimeSelect
//               dateFormat="MMMM d, yyyy h:mm aa"
//               minDate={new Date()}
//               className="custom-date-input"
//             />
//           </div>
//         </Form.Group> */}
