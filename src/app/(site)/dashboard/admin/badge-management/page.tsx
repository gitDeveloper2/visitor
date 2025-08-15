'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Snackbar,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { 
  assignBadgeTextToApp, 
  assignBadgeClassToApp, 
  expandBadgeTextPool,
  getTotalBadgeTexts,
  isValidBadgeText
} from '@/utils/badgeAssignmentService';

interface BadgeText {
  id: string;
  text: string;
  usageCount: number;
  isActive: boolean;
}

interface BadgeClass {
  id: string;
  className: string;
  usageCount: number;
  isActive: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`badge-tabpanel-${index}`}
      aria-labelledby={`badge-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BadgeManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [badgeTexts, setBadgeTexts] = useState<BadgeText[]>([]);
  const [badgeClasses, setBadgeClasses] = useState<BadgeClass[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<BadgeText | BadgeClass | null>(null);
  const [newBadgeText, setNewBadgeText] = useState('');
  const [newBadgeClass, setNewBadgeClass] = useState('');
  const [isAddingText, setIsAddingText] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [previewAppId, setPreviewAppId] = useState('test-app-123');
  const [previewBadge, setPreviewBadge] = useState<string>('');

  useEffect(() => {
    loadBadgeData();
  }, []);

  const loadBadgeData = async () => {
    try {
      const response = await fetch('/api/admin/badge-management');
      const result = await response.json();
      
      if (result.success) {
        const textItems: BadgeText[] = result.data.texts.map((item: any) => ({
          id: item.id,
          text: item.text,
          usageCount: Math.floor(Math.random() * 50) + 1, // Mock data for now
          isActive: true
        }));

        const classItems: BadgeClass[] = result.data.classes.map((item: any) => ({
          id: item.id,
          className: item.className,
          usageCount: Math.floor(Math.random() * 30) + 1, // Mock data for now
          isActive: true
        }));

        setBadgeTexts(textItems);
        setBadgeClasses(classItems);
      }
    } catch (error) {
      console.error('Error loading badge data:', error);
      setSnackbar({ open: true, message: 'Failed to load badge data', severity: 'error' });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddBadge = async () => {
    if (isAddingText) {
      if (!newBadgeText.trim()) {
        setSnackbar({ open: true, message: 'Please enter badge text', severity: 'error' });
        return;
      }
      if (badgeTexts.some(item => item.text.toLowerCase() === newBadgeText.trim().toLowerCase())) {
        setSnackbar({ open: true, message: 'Badge text already exists', severity: 'error' });
        return;
      }
      
      try {
        const response = await fetch('/api/admin/badge-management', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add-texts',
            data: { texts: [newBadgeText.trim()] }
          })
        });
        
        const result = await response.json();
        if (result.success) {
          setSnackbar({ open: true, message: result.message, severity: 'success' });
          setNewBadgeText('');
          setOpenAddDialog(false);
          loadBadgeData(); // Reload data
        } else {
          setSnackbar({ open: true, message: result.error || 'Failed to add badge text', severity: 'error' });
        }
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to add badge text', severity: 'error' });
      }
    } else {
      if (!newBadgeClass.trim()) {
        setSnackbar({ open: true, message: 'Please enter CSS class name', severity: 'error' });
        return;
      }
      if (badgeClasses.some(item => item.className.toLowerCase() === newBadgeClass.trim().toLowerCase())) {
        setSnackbar({ open: true, message: 'CSS class already exists', severity: 'error' });
        return;
      }
      
      try {
        const response = await fetch('/api/admin/badge-management', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add-classes',
            data: { classes: [newBadgeClass.trim()] }
          })
        });
        
        const result = await response.json();
        if (result.success) {
          setSnackbar({ open: true, message: result.message, severity: 'success' });
          setNewBadgeClass('');
          setOpenAddDialog(false);
          loadBadgeData(); // Reload data
        } else {
          setSnackbar({ open: true, message: result.error || 'Failed to add CSS class', severity: 'error' });
        }
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to add CSS class', severity: 'error' });
      }
    }
  };

  const handleEditBadge = (item: BadgeText | BadgeClass) => {
    setEditingItem(item);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    if (isAddingText) {
      const updatedTexts = badgeTexts.map(item =>
        item.id === editingItem.id ? { ...item, text: newBadgeText } : item
      );
      setBadgeTexts(updatedTexts);
    } else {
      const updatedClasses = badgeClasses.map(item =>
        item.id === editingItem.id ? { ...item, className: newBadgeClass } : item
      );
      setBadgeClasses(updatedClasses);
    }

    setOpenEditDialog(false);
    setEditingItem(null);
    setSnackbar({ open: true, message: 'Item updated successfully', severity: 'success' });
  };

  const handleDeleteBadge = (item: BadgeText | BadgeClass) => {
    if (item.usageCount > 0) {
      setSnackbar({ 
        open: true, 
        message: `Cannot delete: ${isAddingText ? 'Badge text' : 'CSS class'} is in use by ${item.usageCount} apps`, 
        severity: 'error' 
      });
      return;
    }

    if (isAddingText) {
      setBadgeTexts(badgeTexts.filter(i => i.id !== item.id));
    } else {
      setBadgeClasses(badgeClasses.filter(i => i.id !== item.id));
    }
    
    setSnackbar({ open: true, message: 'Item deleted successfully', severity: 'success' });
  };

  const handleToggleActive = (item: BadgeText | BadgeClass) => {
    if (isAddingText) {
      setBadgeTexts(badgeTexts.map(i =>
        i.id === item.id ? { ...i, isActive: !i.isActive } : i
      ));
    } else {
      setBadgeClasses(badgeClasses.map(i =>
        i.id === item.id ? { ...i, isActive: !i.isActive } : i
      ));
    }
  };

  const generatePreviewBadge = async () => {
    try {
      const badgeText = await assignBadgeTextToApp(previewAppId);
      const badgeClass = await assignBadgeClassToApp(previewAppId);
      
      const previewHtml = `
        <a href="#" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; border: 1px solid; cursor: pointer; background-color: #ffffff; color: #2563eb; border-color: #dbeafe;" class="${badgeClass}" data-app-id="${previewAppId}" data-badge-text="${badgeText}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <span>${badgeText}</span>
        </a>
      `;
      
      setPreviewBadge(previewHtml);
    } catch (error) {
      console.error('Error generating preview badge:', error);
      setSnackbar({ open: true, message: 'Failed to generate preview badge', severity: 'error' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copied to clipboard', severity: 'info' });
  };

  // Bulk operation handlers
  const handleBulkAddTexts = async (texts: string[]) => {
    try {
      const response = await fetch('/api/admin/badge-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-texts',
          data: { texts }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setNewBadgeText('');
        loadBadgeData();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to add badge texts', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add badge texts', severity: 'error' });
    }
  };

  const handleBulkAddClasses = async (classes: string[]) => {
    try {
      const response = await fetch('/api/admin/badge-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-classes',
          data: { classes }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setNewBadgeClass('');
        loadBadgeData();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to add CSS classes', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add CSS classes', severity: 'error' });
    }
  };

  const handleResetToDefaults = async () => {
    try {
      const response = await fetch('/api/admin/badge-management', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        loadBadgeData();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to reset to defaults', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reset to defaults', severity: 'error' });
    }
  };

  const handleExportPools = async () => {
    try {
      const response = await fetch('/api/admin/badge-management?action=export');
      const result = await response.json();
      
      if (result.success) {
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `badge-pools-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        setSnackbar({ open: true, message: 'Badge pools exported successfully', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to export badge pools', severity: 'error' });
    }
  };

  const handleImportPools = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const response = await fetch('/api/admin/badge-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          data
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        loadBadgeData();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to import badge pools', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to import badge pools', severity: 'error' });
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleInitializePools = async () => {
    try {
      const response = await fetch('/api/admin/initialize-badge-pools', {
        method: 'POST'
      });
      
      const result = await response.json();
      if (result.success) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        loadBadgeData(); // Reload data after initialization
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to initialize badge pools', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize badge pools', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Badge Management System
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="badge management tabs">
          <Tab label={`Badge Texts (${badgeTexts.length})`} />
          <Tab label={`CSS Classes (${badgeClasses.length})`} />
          <Tab label="Preview & Testing" />
          <Tab label="Bulk Operations" />
          <Tab label="Statistics" />
        </Tabs>
      </Paper>

      {/* Badge Texts Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Badge Text Pool</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setIsAddingText(true);
              setOpenAddDialog(true);
            }}
          >
            Add Badge Text
          </Button>
        </Box>

        <Grid container spacing={2}>
          {badgeTexts.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      {item.text}
                    </Typography>
                    <Chip 
                      label={item.isActive ? 'Active' : 'Inactive'} 
                      color={item.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Used by {item.usageCount} apps
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditBadge(item)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Toggle Active">
                    <Switch
                      size="small"
                      checked={item.isActive}
                      onChange={() => handleToggleActive(item)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteBadge(item)}
                      disabled={item.usageCount > 0}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* CSS Classes Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">CSS Class Pool</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setIsAddingText(false);
              setOpenAddDialog(true);
            }}
          >
            Add CSS Class
          </Button>
        </Box>

        <Grid container spacing={2}>
          {badgeClasses.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, fontFamily: 'monospace' }}>
                      .{item.className}
                    </Typography>
                    <Chip 
                      label={item.isActive ? 'Active' : 'Inactive'} 
                      color={item.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Used by {item.usageCount} apps
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditBadge(item)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Toggle Active">
                    <Switch
                      size="small"
                      checked={item.isActive}
                      onChange={() => handleToggleActive(item)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteBadge(item)}
                      disabled={item.usageCount > 0}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Preview & Testing Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Badge Preview & Testing</Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Test App ID"
            value={previewAppId}
            onChange={(e) => setPreviewAppId(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            helperText="Enter an app ID to see how badges would be assigned"
          />
          
          <Button
            variant="contained"
            onClick={generatePreviewBadge}
            startIcon={<ViewIcon />}
            sx={{ mr: 2 }}
          >
            Generate Preview
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => setPreviewAppId(`test-app-${Date.now()}`)}
            startIcon={<RefreshIcon />}
          >
            Random App ID
          </Button>
        </Box>

        {previewBadge && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Preview Badge:</Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <div dangerouslySetInnerHTML={{ __html: previewBadge }} />
            </Paper>
            <Box sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CopyIcon />}
                onClick={() => copyToClipboard(previewBadge)}
              >
                Copy HTML
              </Button>
            </Box>
          </Box>
        )}

        <Alert severity="info">
          <Typography variant="body2">
            <strong>How it works:</strong> Each unique app ID gets deterministically assigned the same badge text and CSS class every time. 
            This ensures consistency while maintaining variety across different apps.
          </Typography>
        </Alert>
      </TabPanel>

      {/* Bulk Operations Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Bulk Operations</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Bulk Add Badge Texts</Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  label="Badge Texts (one per line)"
                  placeholder="Enter badge texts, one per line:&#10;Featured on BasicUtils&#10;Endorsed by BasicUtils&#10;Powered by BasicUtils"
                  value={newBadgeText}
                  onChange={(e) => setNewBadgeText(e.target.value)}
                  helperText="Enter multiple badge texts, one per line"
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const texts = newBadgeText.split('\n').filter(t => t.trim());
                      if (texts.length > 0) {
                        handleBulkAddTexts(texts);
                      }
                    }}
                    disabled={!newBadgeText.trim()}
                  >
                    Add {newBadgeText.split('\n').filter(t => t.trim()).length} Texts
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Bulk Add CSS Classes</Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  label="CSS Classes (one per line)"
                  placeholder="Enter multiple CSS classes, one per line:&#10;featured-badge&#10;endorsed-badge&#10;powered-badge"
                  value={newBadgeClass}
                  onChange={(e) => setNewBadgeClass(e.target.value)}
                  helperText="Enter multiple CSS classes, one per line"
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const texts = newBadgeClass.split('\n').filter(t => t.trim());
                      if (texts.length > 0) {
                        handleBulkAddClasses(texts);
                      }
                    }}
                    disabled={!newBadgeClass.trim()}
                  >
                    Add {newBadgeClass.split('\n').filter(t => t.trim()).length} Classes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>System Management</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleResetToDefaults}
                    startIcon={<RefreshIcon />}
                  >
                    Reset to Defaults
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleExportPools}
                    startIcon={<CopyIcon />}
                  >
                    Export Pools
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => document.getElementById('import-file')?.click()}
                    startIcon={<AddIcon />}
                  >
                    Import Pools
                  </Button>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImportPools}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Statistics Tab */}
      <TabPanel value={tabValue} index={4}>
        <Typography variant="h6" gutterBottom>Badge System Statistics</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {getTotalBadgeTexts()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Badge Texts Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {badgeClasses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total CSS Classes Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  {badgeTexts.filter(t => t.isActive).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Badge Texts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  {badgeClasses.filter(c => c.isActive).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active CSS Classes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>System Information:</Typography>
          <Typography variant="body2" color="text.secondary">
            • Badge texts are assigned deterministically using MD5 hashing of app IDs<br/>
            • Each app gets the same badge text every time for consistency<br/>
            • CSS classes provide visual variety while maintaining functionality<br/>
            • The system automatically handles distribution across the available pools<br/>
            • <strong>Data is now stored persistently in the database</strong>
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="info"
              onClick={handleInitializePools}
              startIcon={<RefreshIcon />}
            >
              Initialize Database Pools
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Run this if you're setting up the system for the first time or after a fresh deployment
            </Typography>
          </Box>
        </Box>
      </TabPanel>

      {/* Add Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New {isAddingText ? 'Badge Text' : 'CSS Class'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={isAddingText ? 'Badge Text' : 'CSS Class Name'}
            fullWidth
            variant="outlined"
            value={isAddingText ? newBadgeText : newBadgeClass}
            onChange={(e) => isAddingText ? setNewBadgeText(e.target.value) : setNewBadgeClass(e.target.value)}
            placeholder={isAddingText ? 'e.g., "Featured on BasicUtils"' : 'e.g., "featured-badge"'}
            helperText={isAddingText ? 
              'Enter a unique, descriptive badge text that users can display' : 
              'Enter a valid CSS class name (use hyphens, no spaces)'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBadge} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit {isAddingText ? 'Badge Text' : 'CSS Class'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={isAddingText ? 'Badge Text' : 'CSS Class Name'}
            fullWidth
            variant="outlined"
            value={isAddingText ? newBadgeText : newBadgeClass}
            onChange={(e) => isAddingText ? setNewBadgeText(e.target.value) : setNewBadgeClass(e.target.value)}
            placeholder={isAddingText ? 'e.g., "Featured on BasicUtils"' : 'e.g., "featured-badge"'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
