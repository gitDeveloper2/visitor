"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  Badge as MuiBadge,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles, typographyVariants, commonStyles } from "@/utils/themeUtils";
import { useEffect, useState } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Eye, ThumbsUp, Plus, BookOpen, TrendingUp, AlertTriangle } from "lucide-react";
import { CreditCard } from "lucide-react";
import Badge from "@components/badges/Badge";
import { VARIANT_IDS } from "@/lib/lemonsqueezy";



export default function ManageBlogsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDraftForPayment, setSelectedDraftForPayment] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch both blogs and drafts
        const [blogsRes, draftsRes] = await Promise.all([
          fetch("/api/user-blogs"),
          fetch("/api/user-blogs/drafts")
        ]);

        if (!blogsRes.ok) throw new Error("Failed to fetch blogs");
        if (!draftsRes.ok) throw new Error("Failed to fetch drafts");

        const blogsData = await blogsRes.json();
        const draftsData = await draftsRes.json();

        setBlogs(blogsData.blogs || []);
        setDrafts(draftsData.drafts || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Published';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const canEdit = (blog: any) => {
    return blog.status === 'pending';
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/user-blogs/draft/${draftId}`, { method: 'DELETE' });
      if (res.ok) {
        setDrafts(prev => prev.filter(draft => draft._id !== draftId));
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={typographyVariants.sectionTitle} gutterBottom>
            Manage Your{" "}
            <Box component="span" sx={commonStyles.textGradient(theme)}>
              Blog Posts
            </Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Track your blog submissions, manage drafts, and monitor their status
          </Typography>
          
          <Button
            component={Link}
            href="/dashboard/submission/blog"
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            sx={{ 
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Write New Blog
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <BookOpen size={24} color={theme.palette.primary.main} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.primary.main }}>
                {blogs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Blogs
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <TrendingUp size={24} color={theme.palette.success.main} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.success.main }}>
                {blogs.filter(b => b.status === 'approved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Clock size={24} color={theme.palette.warning.main} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.warning.main }}>
                {blogs.filter(b => b.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <EditIcon sx={{ color: theme.palette.info.main }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.info.main }}>
                {drafts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drafts
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Published Blogs ({blogs.length})</span>
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Drafts ({drafts.length})</span>
                  {drafts.filter(d => d.premiumReady).length > 0 && (
                    <Chip
                      label={`${drafts.filter(d => d.premiumReady).length} Premium`}
                      color="success"
                      size="small"
                      variant="filled"
                      icon={<span style={{ fontSize: '12px' }}>💎</span>}
                      sx={{ height: '20px', fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              } 
            />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              // Published Blogs Tab
              blogs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <BookOpen size={48} color={theme.palette.text.secondary} />
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    No blogs yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start writing your first blog post to share your knowledge with the community.
                  </Typography>
                  <Button
                    component={Link}
                    href="/dashboard/submission/blog"
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={18} />}
                    sx={{ fontWeight: 600 }}
                  >
                    Write Your First Blog
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {blogs.map((blog) => (
                    <Grid item xs={12} md={6} key={blog._id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          boxShadow: getShadow(theme, "elegant"),
                          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: getShadow(theme, "neon"),
                          },
                        }}
                      >
                        <CardContent sx={{ flex: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ flex: 1, mr: 2, lineHeight: 1.3 }}>
                              {blog.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {blog.isFounderStory && (
                                <Badge variant="founder" label="Founder" />
                              )}
                              <Chip
                                label={getStatusLabel(blog.status)}
                                color={getStatusColor(blog.status) as any}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, flex: 1 }}
                          >
                            {blog.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                          </Typography>

                          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                            {(blog.tags || []).map((tag: string, i: number) => (
                              <Chip key={i} size="small" label={tag} variant="outlined" />
                            ))}
                          </Stack>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Calendar size={14} />
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Clock size={14} />
                              {blog.readTime || Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read
                            </Box>
                          </Box>
                        </CardContent>

                        <Divider />

                        <CardActions sx={{ p: 2, pt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="caption" color="text.secondary">
                              {blog.author || blog.authorName}
                            </Typography>
                            
                            <Stack direction="row" spacing={1}>
                              {canEdit(blog) && (
                                <Tooltip title="Edit Blog">
                                  <IconButton
                                    component={Link}
                                    href={`/dashboard/blogs/edit/${blog._id}`}
                                    size="small"
                                    color="primary"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="View Blog">
                                <IconButton
                                  component={Link}
                                  href={`/blogs/${blog.slug || blog._id}`}
                                  size="small"
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            )}

            {activeTab === 1 && (
              // Drafts Tab
              drafts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <EditIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    No drafts yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start writing to create your first draft.
                  </Typography>
                  <Button
                    component={Link}
                    href="/dashboard/submission/blog"
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={18} />}
                    sx={{ fontWeight: 600 }}
                  >
                    Start Writing
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {drafts.map((draft) => (
                    <Grid item xs={12} md={6} key={draft._id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          boxShadow: getShadow(theme, "elegant"),
                          border: draft.premiumReady ? `2px solid ${theme.palette.success.main}` : 
                                   draft.isExpired ? `2px solid ${theme.palette.error.main}` :
                                   draft.remainingDays === 0 ? `2px solid ${theme.palette.warning.main}` : 'none',
                          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: getShadow(theme, "neon"),
                          },
                        }}
                      >
                        <CardContent sx={{ flex: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ flex: 1, mr: 2, lineHeight: 1.3 }}>
                              {draft.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {draft.premiumReady && (
                                <Chip
                                  label="Premium Ready"
                                  color="success"
                                  size="small"
                                  variant="filled"
                                  icon={<span style={{ fontSize: '12px' }}>💎</span>}
                                />
                              )}
                              {draft.isFounderStory && (
                                <Badge variant="founder" label="Founder" />
                              )}
                              {draft.isExpired && (
                                <Chip
                                  label="Expired"
                                  color="error"
                                  size="small"
                                  variant="filled"
                                  icon={<AlertTriangle size={12} />}
                                />
                              )}
                              {!draft.isExpired && draft.remainingDays === 0 && (
                                <Chip
                                  label="Expires Soon"
                                  color="warning"
                                  size="small"
                                  variant="filled"
                                  icon={<Clock size={12} />}
                                />
                              )}
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, flex: 1 }}
                          >
                            {draft.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                          </Typography>

                          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                            {Array.isArray(draft.tags) &&
                              draft.tags.map((tag: string, i: number) => (
                                <Chip key={i} size="small" label={tag} variant="outlined" />
                              ))}
                          </Stack>

                          {/* Countdown Timer */}
                          {!draft.isExpired && (
                            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: draft.remainingDays === 0 ? 'warning.main' : 'divider' }}>
                              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                <Clock size={14} />
                                <Typography variant="caption" color="text.secondary">
                                  Expires in:
                                </Typography>
                                
                                {draft.remainingDays > 0 && (
                                  <Chip 
                                    label={`${draft.remainingDays}d`} 
                                    size="small" 
                                    color={draft.remainingDays === 0 ? "warning" : "default"}
                                    variant="outlined"
                                  />
                                )}
                                
                                <Chip 
                                  label={`${Math.floor((new Date(draft.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)) % 24}h`} 
                                  size="small" 
                                  color={draft.remainingDays === 0 ? "warning" : "default"}
                                  variant="outlined"
                                />
                                
                                <Chip 
                                  label={`${Math.floor((new Date(draft.expiryDate).getTime() - new Date().getTime()) / (1000 * 60)) % 60}m`} 
                                  size="small" 
                                  color={draft.remainingDays === 0 ? "warning" : "default"}
                                  variant="outlined"
                                />
                              </Stack>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Calendar size={14} />
                              {new Date(draft.createdAt).toLocaleDateString()}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Clock size={14} />
                              {draft.readTime ||
                                Math.ceil(
                                  (draft.content?.replace(/<[^>]*>/g, '') || '')
                                    .split(' ')
                                    .length / 200
                                )
                              } min read
                            </Box>
                          </Box>
                        </CardContent>

                        <Divider />

                        <CardActions sx={{ p: 2, pt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="caption" color="text.secondary">
                              {draft.author || draft.authorName}
                            </Typography>
                            
                            <Stack direction="row" spacing={1}>
                              {!draft.isExpired && (
                                <Tooltip title="Continue Editing">
                                  <IconButton
                                    component={Link}
                                    href={`/dashboard/submission/blog?draft=${draft._id}`}
                                    size="small"
                                    color="primary"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              {!draft.premiumReady && !draft.isExpired && (
                                <Tooltip title="Retry Payment">
                                  <IconButton
                                    onClick={() => setSelectedDraftForPayment(draft)}
                                    size="small"
                                    color="warning"
                                  >
                                    <CreditCard size={16} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              <Tooltip title="Delete Draft">
                                <IconButton
                                  onClick={() => handleDeleteDraft(draft._id)}
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            )}
          </Box>
        </Paper>

        {/* Payment Retry Modal */}
        {selectedDraftForPayment && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2
            }}
            onClick={() => setSelectedDraftForPayment(null)}
          >
            <Paper
              sx={{
                maxWidth: 600,
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                p: 3
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Retry Payment for Draft</Typography>
                <IconButton onClick={() => setSelectedDraftForPayment(null)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Complete your premium subscription to publish "{selectedDraftForPayment.title}"
              </Typography>

              {/* Countdown Timer */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: selectedDraftForPayment.remainingDays === 0 ? 'warning.main' : 'divider' }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Clock size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Draft expires in:
                  </Typography>
                  
                  {selectedDraftForPayment.remainingDays > 0 && (
                    <Chip 
                      label={`${selectedDraftForPayment.remainingDays}d`} 
                      size="small" 
                      color={selectedDraftForPayment.remainingDays === 0 ? "warning" : "default"}
                      variant="outlined"
                    />
                  )}
                  
                  <Chip 
                    label={`${Math.floor((new Date(selectedDraftForPayment.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)) % 24}h`} 
                    size="small" 
                    color={selectedDraftForPayment.remainingDays === 0 ? "warning" : "default"}
                    variant="outlined"
                  />
                  
                  <Chip 
                    label={`${Math.floor((new Date(selectedDraftForPayment.expiryDate).getTime() - new Date().getTime()) / (1000 * 60)) % 60}m`} 
                    size="small" 
                    color={selectedDraftForPayment.remainingDays === 0 ? "warning" : "default"}
                    variant="outlined"
                  />
                </Stack>
              </Box>

              {/* Payment Options */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Choose Your Plan</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select a premium plan to continue with your blog submission.
                </Typography>
                
                {/* Simple payment options */}
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                                         onClick={async () => {
                       try {
                         console.log('🚀 Starting monthly premium payment for draft:', selectedDraftForPayment._id);
                         console.log('📋 Using variant ID:', VARIANT_IDS.PREMIUM_BLOG_MONTHLY);
                         
                         const res = await fetch(`/api/user-blogs/draft/${selectedDraftForPayment._id}/retry-payment`, {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ variantId: VARIANT_IDS.PREMIUM_BLOG_MONTHLY }),
                         });
                         
                         console.log('📡 Payment retry response status:', res.status);
                         
                         if (res.ok) {
                           const responseData = await res.json();
                           console.log('✅ Payment retry successful:', responseData);
                           
                           if (responseData.checkoutUrl) {
                             window.location.href = responseData.checkoutUrl;
                           } else {
                             throw new Error('Checkout URL not found in response');
                           }
                         } else {
                           const errorData = await res.json().catch(() => ({}));
                           console.error('❌ Payment retry failed:', errorData);
                           throw new Error(`Failed to create checkout: ${errorData.message || 'Unknown error'}`);
                         }
                                                } catch (error: any) {
                           console.error('Payment error:', error);
                           alert(`Failed to start payment: ${error.message || 'Unknown error'}`);
                         }
                     }}
                    startIcon={<CreditCard size={16} />}
                  >
                    Monthly Premium ($9.99/month)
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                                         onClick={async () => {
                       try {
                         console.log('🚀 Starting yearly premium payment for draft:', selectedDraftForPayment._id);
                         console.log('📋 Using variant ID:', VARIANT_IDS.PREMIUM_BLOG_YEARLY);
                         
                         const res = await fetch(`/api/user-blogs/draft/${selectedDraftForPayment._id}/retry-payment`, {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ variantId: VARIANT_IDS.PREMIUM_BLOG_YEARLY }),
                         });
                         
                         console.log('📡 Payment retry response status:', res.status);
                         
                         if (res.ok) {
                           const responseData = await res.json();
                           console.log('✅ Payment retry successful:', responseData);
                           
                           if (responseData.checkoutUrl) {
                             window.location.href = responseData.checkoutUrl;
                           } else {
                             throw new Error('Checkout URL not found in response');
                           }
                         } else {
                           const errorData = await res.json().catch(() => ({}));
                           console.error('❌ Payment retry failed:', errorData);
                           throw new Error(`Failed to create checkout: ${errorData.message || 'Unknown error'}`);
                         }
                                                } catch (error: any) {
                           console.error('Payment error:', error);
                           alert(`Failed to start payment: ${error.message || 'Unknown error'}`);
                         }
                     }}
                    startIcon={<CreditCard size={16} />}
                  >
                    Yearly Premium ($99/year)
                  </Button>
                </Stack>
              </Box>

              <Alert severity="info">
                <Typography variant="body2">
                  💡 <strong>Note:</strong> Drafts are automatically deleted after 7 days. 
                  No external notifications will be sent.
                </Typography>
              </Alert>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}
