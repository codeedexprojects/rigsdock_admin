import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider, 
  Chip, 
  CircularProgress, 
  Alert, 
  Button, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { getCustomersByIdApi } from '../../services/allApi';
import { useParams } from 'react-router-dom';

const dummyData = [
  {
    __v: 0,
    _id: "67f5fed81fced2f27ed7119f",
    createdAt: "2025-04-09T05:00:08.436Z",
    email: "abijith@gmail.com",
    mobileNumber: "8590811976",
    name: "Abijith",
    status: "Approved",
    updatedAt: "2025-04-09T05:00:08.436Z",
    verified: true
  }
];

function SingleCustomer() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id}=useParams()

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getCustomersByIdApi(id);
        console.log(response);
        
        if (response.status === 200) {
          setCustomer(response.data);
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        setError('Something went wrong. Showing dummy data.');
        // fallback to dummyData
        const fallback = dummyData.find(cust => cust._id === id);
        if (fallback) setCustomer(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100vh"
        // bgcolor="#f5f5f5"
      >
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent>
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
            <Button 
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
            >
              Back to Customer List
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100vh"
        // bgcolor="#f5f5f5"
      >
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Customer data not found
            </Alert>
            <Button 
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
            >
              Back to Customer List
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{ mb: 2 }}
          >
            Back to Customers
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Customer Details
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Basic Information</Typography>
                  <Chip 
                    label={customer.status} 
                    color={customer.status === "Approved" ? "success" : "warning"}
                    variant="outlined"
                    icon={customer.status === "Approved" ? <CheckCircleIcon /> : <ErrorIcon />}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <TableContainer component={Paper} variant="outlined">
                  <Table aria-label="customer information table">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ width: '30%', bgcolor: '#f9f9f9' }}>
                          Customer ID
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{customer._id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ bgcolor: '#f9f9f9' }}>
                          Name
                        </TableCell>
                        <TableCell>{customer.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ bgcolor: '#f9f9f9' }}>
                          <Box display="flex" alignItems="center">
                            <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                            Email
                          </Box>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ bgcolor: '#f9f9f9' }}>
                          <Box display="flex" alignItems="center">
                            <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                            Mobile Number
                          </Box>
                        </TableCell>
                        <TableCell>{customer.mobileNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ bgcolor: '#f9f9f9' }}>
                          <Box display="flex" alignItems="center">
                            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                            Verification Status
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small"
                            label={customer.verified ? "Verified" : "Not Verified"} 
                            color={customer.verified ? "success" : "error"}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ bgcolor: '#f9f9f9' }}>
                          <Box display="flex" alignItems="center">
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                            Created At
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ bgcolor: '#f9f9f9' }}>
                          <Box display="flex" alignItems="center">
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                            Last Updated
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(customer.updatedAt)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default SingleCustomer;