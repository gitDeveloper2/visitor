import React, { ReactElement } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import { Link as LinkIcon } from "@mui/icons-material";
import Link from "next/link";
import { SidebarLongAd } from "@components/adds";
import { ResponsiveSidebarAd } from "@components/adds/ResponsiveSidebar";
interface LinkListItemProps {
  to: string;
  primary: string;
}

export const LinkListItem: React.FC<LinkListItemProps> = ({ to, primary }) => (
  <ListItem
  button
    sx={{
      display: "flex",
      alignItems: "center",
      padding: "8px 16px",
    }}
    component="li" // No need to use component="a" here
  >
    <ListItemIcon
      sx={{
        minWidth: "auto",
        marginRight: "8px",
        alignSelf: "flex-start",
      }}
    >
      <LinkIcon fontSize="small" />
    </ListItemIcon>
    <Link  style={{
          margin: 0,
          padding: 0,
          fontSize: "1rem",
        }} href={to} passHref>
    {primary}
      {/* <ListItemText
        primary={primary}
        sx={{
          margin: 0,
          padding: 0,
          fontSize: "0.875rem",
          color: "inherit",
        }}
      /> */}
    </Link>
  </ListItem>
);

// Styled component for List
const StyledList = styled(List)(({ theme }) => ({
  maxHeight: "400px",
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
interface LinkItem {
  to: string;
  primary: string;
}

type BlogComponentProps = {
  blogComponent: ReactElement;
  relatedPages: LinkItem[]; // Array of link items
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
}) => {
  const theme = useTheme();

  return (
    <BlogMargins>
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <BlogContentPaper elevation={3}>{blogComponent}</BlogContentPaper>
          </Grid>
          {relatedPages &&
          <Grid item xs={12} md={4}>
            <Sidebar>
            
              <StyledList>
              {relatedPages.map((link, index) => (
                    <LinkListItem
                      key={index}
                      primary={link.primary}
                      to={link.to}
                    />
                  ))}
              </StyledList>
            </Sidebar>
            <ResponsiveSidebarAd/>
          </Grid>
}
        </Grid>
      </Container>
    </BlogMargins>
  );
};

export default BlogComponent;
