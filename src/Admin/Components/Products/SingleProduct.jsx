import React, { useState, useEffect } from 'react';
import { deleteProductApi, getProductByIdApi } from '../../../services/allApi';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Chip, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate, useParams } from 'react-router-dom';
import { IMG_BASE_URL } from '../../../services/baseUrl';

function SingleProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductByIdApi(id);
        
        if (response.status === 200 && response.data.product) {
          setProduct(response.data.product);
        } else {
          throw new Error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleDeleteClick = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteProductApi(product._id);
      if (response.status === 200) {
        navigate('/viewProducts'); 
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again later.");
    } finally {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
    }
  };

  const handleNextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
      setSelectedThumbnail((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
      setSelectedThumbnail((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    setSelectedThumbnail(index);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/viewProducts')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Product not found</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  // Get the current image URL or use placeholder
  const productImageUrl = product.images && product.images.length > 0 
    ? `${IMG_BASE_URL}/uploads/${product.images[currentImageIndex]}`
    : '/placeholder-image.jpg';

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/products')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>
      
      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Grid container>
          {/* Product Images */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative', height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
              {/* Main Image */}
              <Box sx={{ 
                position: 'relative', 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                p: 2
              }}>
                <CardMedia
                  component="img"
                  image={productImageUrl}
                  alt={product.name}
                  sx={{ 
                    maxHeight: 350,
                    objectFit: 'contain',
                  }}
                />
                
                {/* {product.offer && (
                  <Chip
                    label={`${product.offer}% OFF`}
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16
                    }}
                  />
                )} */}
                
                {/* Navigation arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <IconButton 
                      aria-label="previous image"
                      onClick={handlePrevImage}
                      sx={{ 
                        position: 'absolute', 
                        left: 8,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                        boxShadow: 1
                      }}
                    >
                      <ArrowBackIosIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="next image"
                      onClick={handleNextImage}
                      sx={{ 
                        position: 'absolute', 
                        right: 8,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                        boxShadow: 1
                      }}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  p: 1,
                  overflowX: 'auto',
                  gap: 1,
                  justifyContent: 'center'
                }}>
                  {product.images.map((image, index) => (
                    <Box 
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        flexShrink: 0,
                        border: index === selectedThumbnail ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={`${IMG_BASE_URL}/uploads/${image}`}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
          
          {/* Product Details */}
          <Grid item xs={12} md={7}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                  size="small"
                >
                  Delete
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {product.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
                  ₹{product.finalPrice}
                </Typography>
                {product.price !== product.finalPrice && (
                  <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                    ₹{product.price}
                  </Typography>
                )}
                {product.price !== product.finalPrice && (
                  <Chip 
                    label={`${Math.round((1 - product.finalPrice / product.price) * 100)}% off`} 
                    size="small" 
                    color="primary"
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                      Product Details
                    </Typography>
                    <TableContainer component={Box}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ borderBottom: '1px solid #e0e0e0', pl: 0, width: '40%' }}>
                              Brand
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #e0e0e0', pr: 0 }}>
                              {product.brand}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ borderBottom: '1px solid #e0e0e0', pl: 0 }}>
                              Stock
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #e0e0e0', pr: 0 }}>
                              {product.stock} units
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ borderBottom: '1px solid #e0e0e0', pl: 0 }}>
                              Weight
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #e0e0e0', pr: 0 }}>
                              {product.weight} kg
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ borderBottom: 'none', pl: 0 }}>
                              Dimensions
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', pr: 0 }}>
                              {product.length}L × {product.breadth}B × {product.height}H cm
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                      Specifications
                    </Typography>
                    {product.attributes && Object.keys(product.attributes).length > 0 ? (
                      <TableContainer component={Box}>
                        <Table size="small">
                          <TableBody>
                            {Object.entries(product.attributes).map(([key, value], index, array) => (
                              <TableRow key={key}>
                                <TableCell 
                                  component="th" 
                                  sx={{ 
                                    borderBottom: index === array.length - 1 ? 'none' : '1px solid #e0e0e0',
                                    pl: 0,
                                    width: '40%'
                                  }}
                                >
                                  {key}
                                </TableCell>
                                <TableCell 
                                  sx={{ 
                                    borderBottom: index === array.length - 1 ? 'none' : '1px solid #e0e0e0',
                                    pr: 0
                                  }}
                                >
                                  {value}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No specifications available
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseModal}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{product.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseModal} 
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SingleProduct;