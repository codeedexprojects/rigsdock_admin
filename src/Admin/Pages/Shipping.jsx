import React from 'react';
import dtdc from '../../assets/dtdc.png';
import post from '../../assets/indianpost.png';
import bluedart from '../../assets/bluedart.png';
import dhl from '../../assets/dhl.png';
import delhivery from '../../assets/delhivery.png';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function Shipping() {
  const shippingData = [
    {
      image: dtdc,
      title: 'DTDC (Desk to Desk Courier and Cargo)',
      description:
        'Ideal for small businesses or e-commerce companies that need affordable and reliable domestic shipping with international expansion.',
    },
    {
      image: post,
      title: 'India Post (Indian Postal Service)',
      description:
        'Great for budget-conscious customers, especially in rural areas, or those needing government-backed services and more affordable international shipping.',
    },
    {
      image: bluedart,
      title: 'Blue Dart Express',
      description:
        'Best for businesses or individuals requiring fast, reliable, and time-definite deliveries, especially for high-value or urgent shipments.',
    },
    {
      image: dhl,
      title: 'DHL Express',
      description:
        'Customers needing premium international shipping and express services with guaranteed delivery times.',
    },
    {
      image: delhivery,
      title: 'Delhivery',
      description:
        'Tech-driven solutions for e-commerce businesses, offering fast delivery and advanced tracking.',
    },
  ];

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography
        sx={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: '18px',
          lineHeight: '150%',
          letterSpacing: '0%',
          color: '#32343A',
          marginBottom: '20px',
        }}
      >
        Select Shipping Method
      </Typography>
      {shippingData.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0px 0px 6px 0px #0000001F',
            borderRadius: '8px',
          }}
        >
          <Box
            component="img"
            src={item.image}
            alt={item.title}
            sx={{
              width: '100px',
              height: '100px',
              marginRight: '20px',
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#32343A',
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '165%',
                letterSpacing: '0%',
                color: '#71747B',
              }}
            >
              {item.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton sx={{color:'#0A5FBF'}}>
              <LocalShippingIcon />
            </IconButton>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'right',
                color: '#1B54FE',
              }}
            >
              Check Now
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Shipping;