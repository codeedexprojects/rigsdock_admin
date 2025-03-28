import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Pagination,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Vendornotificationpagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); 

  const handleIncrement = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleDecrement = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 4 
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={(e, value) => onPageChange(value)}
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 700,
              fontSize: '12.68px',
              color:'#9FA3A8'
            },
            '& .MuiPaginationItem-root:hover': {
              color:'#0A5FBF'
            },
            '& .Mui-selected': {
              backgroundColor: 'transparent',
              color: '#0A5FBF'
            },
            '& .MuiPaginationItem-previousNext': {
              border: '1px solid rgba(133, 242, 113, 0.4)',
              borderRadius: '7px',
            }
          }}
        />

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '55px', 
            height: '32px', 
            border: '1px solid rgba(133, 242, 113, 0.4)', 
            borderRadius: '7px', 
            backgroundColor: 'white'
          }}
        >
          <Typography 
            sx={{ 
              color:'#0A5FBF',
              fontWeight: 700,
              fontSize: '12.68px',
              pl:1.3, 
              flex:1 
            }}
          >
            {currentPage}
          </Typography>

          <Box sx={{ borderLeft: '1px solid rgba(133, 242, 113, 0.6)', height: '70%', mx: 0.5 }}></Box>

          <Box sx={{ display:'flex', flexDirection:'column', pr: 0.5 }}>
            <IconButton 
              onClick={handleIncrement} 
              size="small" 
              disabled={currentPage >= totalPages}
              sx={{ 
                p: 0, 
                '& .MuiSvgIcon-root': { fontSize: '14px', color: currentPage < totalPages ? '#0066CC' : '#ccc' } 
              }}
            > 
              <ArrowDropUpIcon /> 
            </IconButton>

            <IconButton 
              onClick={handleDecrement} 
              size="small" 
              disabled={currentPage <= 1}
              sx={{ 
                p: 0, 
                '& .MuiSvgIcon-root': { fontSize: '14px', color: currentPage > 1 ? '#0066CC' : '#ccc' } 
              }}
            > 
              <ArrowDropDownIcon/> 
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Vendornotificationpagination;
