import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { useDropzone } from "react-dropzone";
import { Delete, Edit, CloudUpload, FilterList, Search } from "@mui/icons-material";
// import { bulkUploadProductsApi } from "../../services/allApi";

const UploadContainer = styled(Box)({
  border: "2px dashed #A6A6A6",
  borderRadius: "10px",
  padding: "40px",
  textAlign: "center",
  backgroundColor: "#F8FBF8",
  cursor: "pointer",
});

const ActionButtons = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  margin: "20px 0",
});

const FileRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
});

const BulkUpload = () => {
  const [files, setFiles] = useState([]);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, .pdf, .docx",
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        uploadedBy: {
          name: "Ziyad",
          email: "ziyad123@gmail.com",
          avatar: "https://via.placeholder.com/40",
        },
        dateUploaded: "Jan 4, 2025",
      }));
      setFiles([...files, ...newFiles]);
    },
  });

  return (
    <Box p={3}>
      {/* Bulk Upload Header */}
      <Typography variant="h5" fontWeight="bold">
        Bulk upload
      </Typography>

      {/* Drag & Drop File Upload */}
      <UploadContainer {...getRootProps()} mt={2}>
        <input {...getInputProps()} />
        <CloudUpload style={{ fontSize: 50, color: "#A6A6A6" }} />
        <Typography color="textSecondary">
          Drag and Drop file here, choose file
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Add File
        </Button>
      </UploadContainer>

      {/* Buttons - Delete & Next */}
      <ActionButtons>
        <Button variant="outlined" startIcon={<Delete />}>
          Delete
        </Button>
        <Button variant="contained" startIcon={<Edit />}>
          Next
        </Button>
      </ActionButtons>

      {/* Attached Files Section */}
      <Typography variant="h6" fontWeight="bold" mt={4}>
        Attached files
      </Typography>

      {/* Filter & Search */}
      <Box display="flex" gap={2} mt={2}>
        <Button variant="outlined">View all</Button>
        <Button variant="outlined">Your file</Button>
        <TextField placeholder="Search" size="small" InputProps={{ startAdornment: <Search /> }} />
        <Button variant="outlined" startIcon={<FilterList />}>
          Add Filter
        </Button>
      </Box>

      {/* Files Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Date Uploaded</TableCell>
              <TableCell>Last Uploaded</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, index) => (
              <FileRow key={index}>
                <TableCell>
                  <Typography>{file.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {Math.round(file.size / 1024)} KB
                  </Typography>
                </TableCell>
                <TableCell>{file.dateUploaded}</TableCell>
                <TableCell>{file.dateUploaded}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar src={file.uploadedBy.avatar} sx={{ width: 30, height: 30, mr: 1 }} />
                    <Box>
                      <Typography>{file.uploadedBy.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {file.uploadedBy.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </FileRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BulkUpload;
