import React, { useState, useEffect } from "react";
import {
    Container,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Modal,
    TextField,
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";
import { createMainCategoryApi, deleteMainCategoryApi, getMainCategoriesApi, updateMainCategoryApi } from "../../services/allApi";

const MainCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getMainCategoriesApi();
            setCategories(response.data.mainCategories);
            setError("");
        } catch (error) {
            setError("Failed to fetch categories. Please try again.");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            if (editingCategory) {
                await updateMainCategoryApi(editingCategory.id, formData);
            } else {
                await createMainCategoryApi(formData);
            }
            fetchCategories();
            handleClose();
        } catch (error) {
            setError("Failed to save category. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMainCategoryApi(deleteCategoryId);
            fetchCategories();
            handleDeleteClose();
        } catch (error) {
            setError("Failed to delete category. Please try again.");
        }
    };

    const handleOpen = (category = null) => {
        setEditingCategory(category);
        setFormData(category ? { name: category.name, description: category.description } : { name: "", description: "" });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        setError("");
    };

    const handleDeleteOpen = (id) => {
        setDeleteCategoryId(id);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setDeleteCategoryId(null);
    };

    return (
        <Container>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>Add Main-Category</Button>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">{error}</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="warning" size="small" onClick={() => handleOpen(category)}>Edit</Button>
                                    <Button variant="contained" color="error" size="small" onClick={() => handleDeleteOpen(category.id)} sx={{ ml: 1 }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, width: 400, mx: "auto", mt: 10 }}>
                    <Typography variant="h6" gutterBottom>{editingCategory ? "Edit Category" : "Add Category"}</Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <TextField fullWidth label="Name" margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <TextField fullWidth label="Description" margin="normal" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="contained" color="primary" onClick={handleSave} sx={{ ml: 2 }}>{editingCategory ? "Update" : "Save"}</Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={deleteOpen} onClose={handleDeleteClose}>
                <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, width: 400, mx: "auto", mt: 10, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>Confirm Deletion</Typography>
                    <Typography>Are you sure you want to delete this category?</Typography>
                    <Box mt={2} display="flex" justifyContent="center">
                        <Button variant="contained" color="secondary" onClick={handleDeleteClose}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>Delete</Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default MainCategoryManagement;
