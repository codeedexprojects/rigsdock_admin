import React, { useState, useEffect } from "react";
import { getReportApi, getsellerApi } from "../../services/allApi";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  
  Table,
  Spinner,
  Badge
} from "react-bootstrap";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  TextField,
  Paper,
  Chip,
} from "@mui/material";
import { 
  CloudDownload, 
  FilterList, 
  AccountBalance, 
  ShoppingCart, 
  AttachMoney
} from "@mui/icons-material";
import * as XLSX from 'xlsx';

function Reports() {
  const [reports, setReports] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const today = new Date();
      const formattedMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      setSelectedMonth(formattedMonth);
      
      try {
        // Fetch sellers
        const sellersData = await getsellerApi();
        if (sellersData.success) {
          setSellers(sellersData.data.vendors || []);
        }
        console.log(sellersData);
        
        // Fetch reports
        await fetchReports(formattedMonth);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (reports) {
      filterReports();
    }
  }, [reports, selectedSeller]);

  const fetchReports = async (month, vendorId = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("month", month);
      if (vendorId) {
        queryParams.append("vendorId", vendorId);
      }
      
      const data = await getReportApi(month, vendorId);
      console.log("Report data:", data);
      
      if (data.success) {
        setReports(data.data);
        setFilteredReports(data.data.report || []);
      } else {
        console.error("Error fetching reports:", data.error);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    if (!reports) return;
    
    let filtered = [...reports.report];
    
    if (selectedSeller) {
      filtered = filtered.filter(order => order.vendor === selectedSeller);
    }
    
    setFilteredReports(filtered);
  };

  const handleMonthChange = async (event) => {
    const value = event.target.value;
    setSelectedMonth(value);
    await fetchReports(value, selectedSeller);
  };

  const handleSellerChange = (event) => {
    const value = event.target.value;
    setSelectedSeller(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'primary';
      case 'Cancelled':
        return 'danger';
      case 'Pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const downloadExcel = () => {
    if (!filteredReports.length) return;
    
    // Prepare data for export
    const exportData = filteredReports.map(order => ({
      'Order ID': order.mainOrderId,
      'Date': formatDate(order.createdAt),
      'Customer': order.user?.name || 'N/A',
      'Total Amount': order.totalPrice,
      'Commission': order.totalCommission,
      'Vendor Amount': order.totalVendorAmount,
      'Order Status': order.orderStatus,
      'Payment Status': order.paymentStatus,
      'Payment Method': order.paymentMethod,
      'Settled': order.settled ? 'Yes' : 'No'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Report");
    
    // Generate file name with current date
    const fileName = `Vendor_Report_${selectedMonth}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
  };

  const calculateTotalRevenue = () => {
    if (!filteredReports.length) return 0;
    return filteredReports.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  };

  const calculateTotalCommission = () => {
    if (!filteredReports.length) return 0;
    return filteredReports.reduce((sum, order) => sum + (order.totalCommission || 0), 0);
  };

  const calculateTotalVendorAmount = () => {
    if (!filteredReports.length) return 0;
    return filteredReports.reduce((sum, order) => sum + (order.totalVendorAmount || 0), 0);
  };

  const getTotalSettledOrders = () => {
    if (!filteredReports.length) return 0;
    return filteredReports.filter(order => order.settled).length;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Paper elevation={2} className="p-4">
            <Typography variant="h4" component="h1" gutterBottom>
              Vendor Monthly Reports
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Review and analyze vendor performance and settlements
            </Typography>
          </Paper>
        </Col>
      </Row>

      {/* Filter Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <TextField
                    fullWidth
                    label="Select Month"
                    type="month"
                    variant="outlined"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select Vendor</InputLabel>
                    <Select
                      value={selectedSeller}
                      onChange={handleSellerChange}
                      label="Select Vendor"
                    >
                      <MenuItem value="">All Vendors</MenuItem>
                      {sellers.map((seller) => (
                        <MenuItem key={seller._id} value={seller._id}>
                          {seller.ownername}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
                <Col md={4} className="d-flex align-items-center justify-content-end">
                  <Button 
                    variant="success" 
                    onClick={downloadExcel}
                    disabled={!filteredReports.length}
                    className="d-flex align-items-center"
                  >
                    <CloudDownload className="me-2" />
                    Download Excel
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-3">
                <ShoppingCart fontSize="large" style={{ color: '#3f51b5' }} />
              </div>
              <Typography variant="h5">{filteredReports.length}</Typography>
              <Typography variant="body2" color="textSecondary">Total Orders</Typography>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-3">
                <AttachMoney fontSize="large" style={{ color: '#4caf50' }} />
              </div>
              <Typography variant="h5">{formatCurrency(calculateTotalRevenue())}</Typography>
              <Typography variant="body2" color="textSecondary">Total Revenue</Typography>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-3">
                <AccountBalance fontSize="large" style={{ color: '#ff9800' }} />
              </div>
              <Typography variant="h5">{formatCurrency(calculateTotalCommission())}</Typography>
              <Typography variant="body2" color="textSecondary">Total Commission</Typography>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-3">
                <FilterList fontSize="large" style={{ color: '#f44336' }} />
              </div>
              <Typography variant="h5">{getTotalSettledOrders()} / {filteredReports.length}</Typography>
              <Typography variant="body2" color="textSecondary">Settled Orders</Typography>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Data Table */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {loading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : filteredReports.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Order Status</th>
                        <th>Payment</th>
                        <th>Amount</th>
                        <th>Commission</th>
                        <th>Vendor Amount</th>
                        <th>Settled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <small className="text-muted">{order.mainOrderId.substring(order.mainOrderId.length - 8)}</small>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td>
                            <Badge bg={getStatusBadgeVariant(order.orderStatus)}>
                              {order.orderStatus}
                            </Badge>
                          </td>
                          <td>
                            <div>
                              <Badge bg={getPaymentStatusBadgeVariant(order.paymentStatus)} className="me-2">
                                {order.paymentStatus}
                              </Badge>
                              <small className="text-muted">{order.paymentMethod}</small>
                            </div>
                          </td>
                          <td>{formatCurrency(order.totalPrice)}</td>
                          <td>{formatCurrency(order.totalCommission || 0)}</td>
                          <td>{formatCurrency(order.totalVendorAmount || order.totalPrice)}</td>
                          <td>
                            <Chip 
                              label={order.settled ? "Yes" : "No"}
                              color={order.settled ? "success" : "default"}
                              size="small"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-5">
                  <Typography variant="body1" color="textSecondary">
                    No reports available for the selected criteria
                  </Typography>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Reports;