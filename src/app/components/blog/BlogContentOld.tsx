import React, { ReactElement } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Box,
  List,
  useMediaQuery,
} from "@mui/material";
import Sidebar from "../layout/Sidebar";
import { Link as LinkIcon } from "@mui/icons-material";
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
// import { SidebarLongAd, SidebarSquareAd } from "@components/adds";
interface LinkListItemProps {
  to: string;
  primary: string;
}

// Styled component for List
const StyledList = styled(List)(({ theme }) => ({
  // maxHeight: "70vh",
  overflowY: "auto",
  padding: 0,
  margin: 0,
  borderRadius: "8px",
  backgroundColor: theme.palette.background.paper,
  "& .MuiListItem-root": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    padding: "8px 16px", // Consistent padding
    minHeight: "48px", // Minimum height for accessibility
    textDecoration: "none",
    "&:last-child": {
      borderBottom: "none",
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  "& .MuiListItemIcon-root": {
    minWidth: "auto", // Adjust icon width for alignment
    marginRight: "8px",
  },
  "& .MuiListItemText-root": {
    margin: 0,
    padding: 0,
    fontSize: "0.875rem",
  },
  "& .MuiListItem-root a": {
    display: "flex",
    alignItems: "center",
    textDecoration: "none", // No underline by default
    color: theme.palette.primary.main, // Link color
    width: "100%", // Ensure links take up full width
  },
  "& .MuiListItem-root a:hover": {
    textDecoration: "underline", // Underline on hover
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

// Styled component for Blog margins
const BlogMargins = styled("div")(({ theme }) => ({
  margin: "16px 0",
  [theme.breakpoints.up("md")]: {
    margin: "32px 0",
  },
}));

// Styled component for Blog content Paper
const BlogContentPaper = styled(Paper)(({ theme }) => ({
  padding: "1rem",
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

  return (
    <BlogMargins>
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={isNews ? 12 : 8}>
            <BlogContentPaper
              elevation={3}
              sx={{
                maxWidth: "768px", // or 720px / 800px
                margin: "0 auto",
                padding: { xs: "1rem", md: "2rem" },
              
              }}
            >
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
                    <FacebookComments
                      title="Comments"
                      numPosts={8}
                      width="100%"
                      url={"https://basicutils.com" + url}
                    />
                  )}
                  {/* <div class="fb-comments" data-href="https://yourwebsite.com/your-article" data-width="" data-numposts="5"></div> */}
                </article>
              </main>
            </BlogContentPaper>
          </Grid>
          {isBlog && relatedPages && (
            <Grid item xs={12} md={4} sx={{
    
    height:'100vh',
    overflow:'visible',
    position:'sticky',
    top:'40px',
    mb:6

            }}
           >
              <aside>
                <Sidebar>
                  <Box
    sx={{
      
    }}
  >
                  <StyledList>
                   
                      {relatedPages
                        .filter((obj) => obj.meta_description?.split(/\s+/).length > 10)
                        .map((obj, index) => {
                      
                      // console.log(obj.url)
                      if(index==0){
                        return<div  key={index}>
                        <GoogleAd slot="8142693793"/>
                        <ArticleCard
                        canonical_url={obj.url}
                        keywords={obj.keywords}
                        meta_description={obj.meta_description}
                        title={obj.title}
                     

                        />
                        </div> 

                      }
                      return (
                        <div  key={index}>

                        <ArticleCard
                        canonical_url={obj.url}
                        keywords={obj.keywords}
                        meta_description={obj.meta_description}
                        title={obj.title}
                      // key={index}

                        />
                        </div>
                      );
                    })}
                  </StyledList>
                  </Box>

                </Sidebar>
              </aside>
              {/* <SidebarSquareAd/> */}
            </Grid>
          )}
        </Grid>
      </Container>
    </BlogMargins>
  );
};

export default BlogComponent;
