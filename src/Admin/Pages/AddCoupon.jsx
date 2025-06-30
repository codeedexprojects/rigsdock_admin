import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";


import moment from "moment";
import { createcouponApi, editCouponApi, getCategoriesApi, getproductsApi, getSubCategoriesApi } from "../../services/allApi";

function AddCoupon({ couponToEdit, onSuccess }) {
  const [mainOptions] = useState(["Products", "Categories", "Subcategories"]);
  const [selectedMainOption, setSelectedMainOption] = useState("");
  const initialFormData = {
    name: "",
    couponCode: "",
    discountType: "percentage",
    discountValue: 0,
    targetType: "",
    target: "",
    validFrom: "",
    validTo: "",
    usageLimit: "",
    minPurchaseAmount: "",
    firstPurchaseOnly: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [runLength, setRunLength] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [selectedTargetType, setSelectedTargetType] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const mapTargetTypeToMainOption = (targetType) => {
    if (targetType === "Product") return "Products";
    if (targetType === "Category") return "Categories";
    if (targetType === "Subcategory") return "Subcategories";
    return "";
  };

  // Initialize form for editing an existing coupon
  useEffect(() => {
    if (couponToEdit) {
      setIsEditMode(true);
      
      // First get the main option based on target type
      const mainOption = mapTargetTypeToMainOption(couponToEdit.targetType);
      setSelectedMainOption(mainOption);
      setSelectedTargetType(couponToEdit.targetType);
      
      // Fetch the relevant options list based on the target type
      fetchData(mainOption).then(() => {
        // Set the selected option ID after data is fetched
        setSelectedOptionId(couponToEdit.target);
      });
      
      // Format dates
      const formattedFromDate = couponToEdit.validFrom ? 
        moment(couponToEdit.validFrom).format("YYYY-MM-DD") : "";
      const formattedToDate = couponToEdit.validTo ?
        moment(couponToEdit.validTo).format("YYYY-MM-DD") : "";
      
      // Set dates for run length calculation
      setFromDate(formattedFromDate);
      setToDate(formattedToDate);
      
      // Update form data with coupon details
      setFormData({
        name: couponToEdit.name || "",
        couponCode: couponToEdit.couponCode || "",
        discountType: couponToEdit.discountType || "percentage",
        discountValue: couponToEdit.discountValue || 0,
        targetType: couponToEdit.targetType || "",
        target: couponToEdit.target || "",
        validFrom: formattedFromDate,
        validTo: formattedToDate,
        usageLimit: couponToEdit.usageLimit || "",
        minPurchaseAmount: couponToEdit.minPurchaseAmount || "",
        firstPurchaseOnly: couponToEdit.firstPurchaseOnly || false,
      });
      
      // Calculate run length
      if (formattedFromDate && formattedToDate) {
        calculateRunLength(formattedFromDate, formattedToDate);
      }
    }
  }, [couponToEdit]);

  const mapTargetType = (option) => {
    if (option === "Products") return "Product";
    if (option === "Categories") return "Category";
    if (option === "Subcategories") return "Subcategory";
    return "";
  };

  const handleMainDropdownChange = (e) => {
    const selected = e.target.value;
    setSelectedMainOption(selected);
    setSelectedTargetType(mapTargetType(selected));
    setSelectedOptionId(""); // Reset selected option when main category changes

    if (selected) {
      fetchData(selected);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOptionId(e.target.value);
  };

  const handleFromDateChange = (value) => {
    setFromDate(value);
    if (toDate) {
      calculateRunLength(value, toDate);
    }
  };

  const handleToDateChange = (value) => {
    setToDate(value);
    if (fromDate) {
      calculateRunLength(fromDate, value);
    }
  };

  const calculateRunLength = (from, to) => {
    const start = moment(from);
    const end = moment(to);

    if (start.isValid() && end.isValid() && end.isAfter(start)) {
      const days = end.diff(start, "days") + 1;
      setRunLength(
        `Active Days: ${days} (${start.format("DD MMM YYYY")} - ${end.format(
          "DD MMM YYYY"
        )})`
      );
    } else {
      setRunLength(""); 
    }
  };
  
  const fetchData = async (type) => {
    try {
      let response;
      if (type === "Products") {
        response = await getproductsApi();
        if (response && response.data) {
          setProducts(response.data.products);
        }
      } else if (type === "Categories") {
        response = await getCategoriesApi();
        console.log("categories",response);
        
        if (response && response.data) {
          setCategories(response.data.categories);
        }
      } else if (type === "Subcategories") {
        response = await getSubCategoriesApi();
        if (response && response.data) {
          setSubcategories(response.data.subCategories);
        }
      }
      return response;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      if (type === "Products") setProducts([]);
      if (type === "Categories") setCategories([]);
      if (type === "Subcategories") setSubcategories([]);
      return null;
    }
  };

  // Get filtered data based on selection
  const getFilteredOptions = () => {
    if (selectedMainOption === "Products") return products;
    if (selectedMainOption === "Categories") return categories;
    if (selectedMainOption === "Subcategories") return subcategories;
    return [];
  };

  const filteredOptions = getFilteredOptions();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure selectedOptionId and selectedTargetType are properly set
    if (!selectedOptionId || !selectedTargetType) {
      alert("Please select a target type and option.");
      return;
    }

    // Merge selected values into formData
    const updatedFormData = {
      ...formData,
      targetType: selectedTargetType,
      target: selectedOptionId,
    };

    if (moment(updatedFormData.validTo).isBefore(updatedFormData.validFrom)) {
      alert("End date must be after start date");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", updatedFormData.name);
      payload.append("couponCode", updatedFormData.couponCode);
      payload.append("discountType", updatedFormData.discountType);
      payload.append("discountValue", Number(updatedFormData.discountValue));
      payload.append("targetType", updatedFormData.targetType);
      payload.append("target", updatedFormData.target);
      payload.append("validFrom", updatedFormData.validFrom);
      payload.append("validTo", updatedFormData.validTo);
      payload.append("usageLimit", Number(updatedFormData.usageLimit));
      payload.append(
        "minPurchaseAmount",
        Number(updatedFormData.minPurchaseAmount)
      );
      payload.append("firstPurchaseOnly", updatedFormData.firstPurchaseOnly);

      let response;
      if (isEditMode && couponToEdit?._id) {
        // Editing existing coupon
        payload.append("couponId", couponToEdit._id);
        response = await editCouponApi(payload);
        if (response.data) {
          alert("Coupon updated successfully");
          if (onSuccess) onSuccess();
        }
      } else {
        // Creating new coupon
        response = await createcouponApi(payload);
        if (response.data) {
          alert("Coupon created successfully");
          setFormData(initialFormData);
          setRunLength("");
          setSelectedMainOption("");
          setSelectedOptionId("");
          setSelectedTargetType("");
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error(isEditMode ? "Coupon update failed:" : "Coupon creation failed:", error);
      alert(error.response?.data?.message || (isEditMode ? "Coupon update failed" : "Coupon creation failed"));
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "validFrom") {
      setFromDate(value);
      if (formData.validTo) {
        calculateRunLength(value, formData.validTo);
      }
    } else if (name === "validTo") {
      setToDate(value);
      if (formData.validFrom) {
        calculateRunLength(formData.validFrom, value);
      }
    }
  };

  const handleCancel = () => {
    if (onSuccess) onSuccess();
  };

  return (
    <div className="coupon-container ">
      <h3 className="mb-4 add-coupon-heading">
        {isEditMode ? "Edit Coupon" : "Coupon Setting"}
      </h3>

      <Form>
        {/* Section 1: Coupon Info */}
        <div className="mb-4">
          <h5 className="add-coupon-subheading">
            <span className="add_coupon_sn">1</span>Coupon Info
          </h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="addcoupon_label">Coupon Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter Coupon Name"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="addcoupon_label">Select</Form.Label>
                <Form.Select
                  className="addcoupon_form"
                  onChange={handleMainDropdownChange}
                  value={selectedMainOption}
                >
                  <option value="">Select</option>
                  {mainOptions.map((opt, index) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {selectedMainOption && (
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="addcoupon_label">Options</Form.Label>
                  <Form.Select
                    className="addcoupon_form"
                    onChange={handleOptionChange}
                    value={selectedOptionId}
                  >
                    <option value="">Select {selectedMainOption}</option>
                    {filteredOptions.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
          </Row>
        </div>

        <div className="mb-4">
          <h5 className="add-coupon-subheading">
            <span className="add_coupon_sn">2</span> Time Manage
          </h5>
          <Row className="g-3">
            <Col md={2}>
              <Form.Group>
                <Form.Label className="addcoupon_label">From</Form.Label>
                <Form.Control
                  className="addcoupon_form"
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="addcoupon_label">To</Form.Label>
                <Form.Control
                  className="addcoupon_form"
                  type="date"
                  name="validTo"
                  value={formData.validTo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label className="addcoupon_label">Run Length</Form.Label>
                <Form.Control
                  className="addcoupon_form"
                  type="text"
                  value={runLength}
                  placeholder="Select From & To Dates"
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Section 3: Coupon Value */}
        <div className="mb-4">
          <h5 className="add-coupon-subheading">
            <span className="add_coupon_sn">3</span>Coupon Value
          </h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="addcoupon_label">Type</Form.Label>
                <Form.Select
                  className="addcoupon_form"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="addcoupon_label">Value</Form.Label>
                <Form.Control
                  className="addcoupon_form"
                  type="text"
                  placeholder="Value"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="addcoupon_label">Code</Form.Label>
                <Form.Control
                  className="addcoupon_form"
                  type="text"
                  placeholder="Code"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Section 4: Coupon Conditions */}
        <div className="mb-4">
          <h5 className="add-coupon-subheading">
            <span className="add_coupon_sn">4</span>Coupon Conditions
          </h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="addcoupon_label">Usage Limit</Form.Label>
                <Form.Control
                  className="addcoupon_form"
                  type="number"
                  placeholder="0"
                  defaultValue={0}
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="addcoupon_label">
                  Minimum Purchase Amount
                </Form.Label>
                <Form.Control
                  className="addcoupon_form"
                  type="number"
                  placeholder="0"
                  defaultValue={0}
                  name="minPurchaseAmount"
                  value={formData.minPurchaseAmount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Form.Group>
                <Form.Check
                  name="firstPurchaseOnly"
                  checked={formData.firstPurchaseOnly}
                  onChange={handleChange}
                  type="checkbox"
                  label="First Purchase Only"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Form>
      <div className="d-flex gap-2">
        <Button onClick={handleSubmit} variant="primary" type="submit">
          {isEditMode ? "Update Coupon" : "Save Coupon"}
        </Button>
        {isEditMode && (
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export default AddCoupon;