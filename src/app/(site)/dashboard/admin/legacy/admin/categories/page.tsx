"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Category as CategoryIcon,
  Apps as AppsIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface Category {
  _id: string;
  name: string;
  slug: string;
  type: 'app' | 'blog' | 'both';
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  parentCategory?: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
  stats?: {
    appCount: number;
    blogCount: number;
    totalViews: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  type: 'app' | 'blog' | 'both';
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  parentCategory: string;
  metadata: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
}

export default function CategoriesManagementPage() {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    type: 'both',
    description: '',
    icon: '',
    color: '#1976d2',
    sortOrder: 0,
    parentCategory: '',
    metadata: {
      seoTitle: '',
      seoDescription: '',
      keywords: []
    }
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (error) {
      setError('Error fetching categories');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        type: category.type,
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '#1976d2',
        sortOrder: category.sortOrder,
        parentCategory: category.parentCategory || '',
        metadata: {
          seoTitle: category.metadata?.seoTitle || '',
          seoDescription: category.metadata?.seoDescription || '',
          keywords: category.metadata?.keywords || []
        }
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        type: 'both',
        description: '',
        icon: '',
        color: '#1976d2',
        sortOrder: 0,
        parentCategory: '',
        metadata: {
          seoTitle: '',
          seoDescription: '',
          keywords: []
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSnackbar({
          open: true,
          message: editingCategory ? 'Category updated successfully' : 'Category created successfully',
          severity: 'success'
        });
        handleCloseDialog();
        fetchCategories();
      } else {
        setSnackbar({
          open: true,
          message: data.error || 'Operation failed',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving category',
        severity: 'error'
      });
      console.error('Error:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Category deleted successfully',
          severity: 'success'
        });
        fetchCategories();
      } else {
        setSnackbar({
          open: true,
          message: data.error || 'Delete failed',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting category',
        severity: 'error'
      });
      console.error('Error:', error);
    }
  };

  const handleToggleActive = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSnackbar({
          open: true,
          message: `Category ${currentStatus ? 'deactivated' : 'activated'} successfully`,
          severity: 'success'
        });
        fetchCategories();
      } else {
        setSnackbar({
          open: true,
          message: data.error || 'Update failed',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating category',
        severity: 'error'
      });
      console.error('Error:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'app': return <AppsIcon />;
      case 'blog': return <ArticleIcon />;
      case 'both': return <CategoryIcon />;
      default: return <CategoryIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'app': return 'primary';
      case 'blog': return 'secondary';
      case 'both': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={fetchCategories} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Category Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage app and blog categories centrally. Create, edit, and organize categories for better content organization.
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" component="h2">
            Total Categories: {categories.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Category
        </Button>
      </Box>

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: category.isActive ? '1px solid' : '1px solid',
                borderColor: category.isActive ? 'divider' : 'error.main',
                opacity: category.isActive ? 1 : 0.7
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Category Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: category.color || theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2
                    }}
                  >
                    {getTypeIcon(category.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {category.name}
                    </Typography>
                    <Chip
                      label={category.type}
                      size="small"
                      color={getTypeColor(category.type) as any}
                      icon={getTypeIcon(category.type)}
                    />
                  </Box>
                </Box>

                {/* Description */}
                {category.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                )}

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip
                    label={`${category.stats?.appCount || 0} apps`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${category.stats?.blogCount || 0} blogs`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {/* Metadata */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Slug: {category.slug}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Order: {category.sortOrder}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <Tooltip title={category.isActive ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleActive(category._id, category.isActive)}
                      color={category.isActive ? 'success' : 'error'}
                    >
                      {category.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(category)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(category._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                helperText="Auto-generated if left empty"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <MenuItem value="app">App Only</MenuItem>
                  <MenuItem value="blog">Blog Only</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Icon (Material-UI icon name)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., Apps, Article, Category"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="SEO Metadata" icon={<SettingsIcon />} />
              </Divider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SEO Title"
                value={formData.metadata.seoTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, seoTitle: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SEO Description"
                value={formData.metadata.seoDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, seoDescription: e.target.value }
                })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 