import React, { ReactElement } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Box,
  List,
  useMediaQuery,
  Typography,
  Chip,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import Sidebar from "../layout/Sidebar";
import { Link as LinkIcon, Home, School, ArrowForward } from "@mui/icons-material";
import Link from "next/link";
import { RelatedPage } from "./BloogComponentContainer";
import { LinkListItem } from "./BlogContent";
import { BibliographyState } from "../../../hooks/useBibliography";
import { Bibliography } from "@components/libs/Biography";
import { BibliographyList, CitationDisplay } from "./BibliographyList";
import FacebookComments from "./FacebookComments";
import { AuthorProfile } from "../../../types/Author";
import AuthorSection from "./AuthorSection";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport";
import SemanticFAQComponent from "./Faqs";
import { FAQ } from "@components/libs/faqReducer";
import ArticleCard from "@components/articlecard/articleCardInPage";
import GoogleAd from "@components/adds/google/GoogleAd";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "../../../utils/themeUtils";
// import { SidebarLongAd, SidebarSquareAd } from "@components/adds";

interface LinkListItemProps {
  to: string;
  primary: string;
}

// Enhanced styled component for List
const StyledList = styled(List)(({ theme }) => ({
  overflowY: "auto",
  padding: 0,
  margin: 0,
  borderRadius: "16px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.custom?.shadows?.elegant || "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  "& .MuiListItem-root": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    minHeight: "56px",
    textDecoration: "none",
    transition: "all 0.2s ease-in-out",
    "&:last-child": {
      borderBottom: "none",
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      transform: "translateX(4px)",
    },
  },
  "& .MuiListItemIcon-root": {
    minWidth: "auto",
    marginRight: "12px",
    color: theme.palette.primary.main,
  },
  "& .MuiListItemText-root": {
    margin: 0,
    padding: 0,
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  "& .MuiListItem-root a": {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.palette.primary.main,
    width: "100%",
    fontWeight: 500,
  },
  "& .MuiListItem-root a:hover": {
    textDecoration: "underline",
    textUnderlineOffset: "0.2em",
  },
}));

type BlogComponentProps = {
  type?: "news" | "blog";
  blogComponent: ReactElement;
  relatedPages: RelatedPage[];
  refs: BibliographyState;
  url: string;
  author: AuthorProfile;
  faqs: FAQ[];
  // relatedPages: LinkItem[]; // Array of link items
};

// Enhanced styled component for Blog margins
const BlogMargins = styled("div")(({ theme }) => ({
  margin: "24px 0",
  [theme.breakpoints.up("md")]: {
    margin: "48px 0",
  },
}));

// Enhanced styled component for Blog content Paper
const BlogContentPaper = styled(Paper)(({ theme }) => ({
  padding: "1.5rem",
  borderRadius: "20px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.custom?.shadows?.elegant || "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  background: theme.palette.background.paper,
  [theme.breakpoints.up("md")]: {
    padding: "3rem",
  },
  "&:hover": {
    boxShadow: theme.custom?.shadows?.neon || "0 8px 25px rgba(0, 0, 0, 0.15)",
  },
}));

// Enhanced styled component for Sidebar
const EnhancedSidebar = styled(Sidebar)(({ theme }) => ({
  borderRadius: "20px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.custom?.shadows?.elegant || "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  background: theme.palette.background.paper,
  padding: "1.5rem",
  [theme.breakpoints.up("md")]: {
    padding: "2rem",
  },
}));

// BlogComponent functional component
const BlogComponent: React.FC<BlogComponentProps> = ({
  blogComponent,
  relatedPages,
  refs,
  url,
  author,
  faqs,
  type,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("md"));
  const isBlog = type === "blog";
  const isNews = type === "news";

  // Extract domain and slug from URL for breadcrumbs
  const urlParts = url.split('/').filter(Boolean);
  const domain = urlParts[1] || 'learn';
  const slug = urlParts[2] || '';
  const pageTitle = slug ? slug.replace(/-/g, ' ') : 'Article';

  return (
    <BlogMargins>
      <Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={isNews ? 12 : 8}>
            <BlogContentPaper
              elevation={3}
              sx={{
                maxWidth: "100%",
                margin: "0 auto",
                padding: { xs: "1.5rem", md: "2.5rem" },
                borderRadius: "16px",
                boxShadow: (theme) => theme.custom?.shadows?.elegant || "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Breadcrumbs */}
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
                <MuiLink component={Link} href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Home sx={{ mr: 0.5, fontSize: 'inherit' }} />
                  Home
                </MuiLink>
                <MuiLink component={Link} href="/learn" sx={{ display: 'flex', alignItems: 'center' }}>
                  <School sx={{ mr: 0.5, fontSize: 'inherit' }} />
                  Learn
                </MuiLink>
                {domain && (
                  <MuiLink component={Link} href={`/learn/${domain}`} sx={{ display: 'flex', alignItems: 'center' }}>
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </MuiLink>
                )}
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  {pageTitle}
                </Typography>
              </Breadcrumbs>
              <Divider sx={{ mb: 4 }} />
              <main>
                <article>
                  <div id="learn-wrapper">{blogComponent}</div>
                  <SemanticFAQComponent faqData={faqs} />
                  <CitationDisplay
                    displayAPA={true}
                    backgroundReferences={Object.values(refs?.background || {})}
                    inlineReferences={Object.values(refs?.inline || {})}
                  />
                  <AuthorSection
                    bio={author.bio}
                    name={author.name}
                    photoUrl={author.profilePicture}
                    socialLinks={author.socialLinks}
                  />
                  {isBlog && isTablet && (
                    <Box sx={{ mt: 6 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          ...typographyVariants.sectionTitle,
                          fontSize: { xs: '1.5rem', sm: '1.75rem' },
                          mb: 3,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Join the Discussion
                      </Typography>
                      <FacebookComments
                        title="Comments"
                        numPosts={8}
                        width="100%"
                        url={"https://basicutils.com" + url}
                      />
                    </Box>
                  )}
                </article>
              </main>
            </BlogContentPaper>
          </Grid>

          {/* Sidebar */}
          {isBlog && relatedPages && (
            <Grid 
              item 
              xs={12} 
              md={4} 
              sx={{
                height: 'fit-content',
                overflow: 'visible',
                position: 'sticky',
                top: '80px',
                mb: 6
              }}
            >
              <aside>
                <EnhancedSidebar>
                  <Box>
                    {/* Sidebar Header */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          ...typographyVariants.cardTitle,
                          fontSize: { xs: '1.25rem', sm: '1.5rem' },
                          mb: 2,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Related Articles
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                          fontSize: '0.875rem',
                        }}
                      >
                        Explore more content to expand your knowledge
                      </Typography>
                    </Box>

                    {/* Google Ad */}
                    <Box sx={{ mb: 4 }}>
                      <GoogleAd slot="8142693793"/>
                    </Box>

                    {/* Related Pages */}
                    <StyledList>
                      {relatedPages
                        .filter((obj) => obj.meta_description?.split(/\s+/).length > 10)
                        .map((obj, index) => (
                          <div key={index}>
                            <ArticleCard
                              canonical_url={obj.url}
                              keywords={obj.keywords}
                              meta_description={obj.meta_description}
                              title={obj.title}
                            />
                          </div>
                        ))}
                    </StyledList>
                  </Box>
                </EnhancedSidebar>
              </aside>
            </Grid>
          )}
        </Grid>
      </Container>
    </BlogMargins>
  );
};

export default BlogComponent;
