// BlogComponent.tsx
import React, { ReactElement } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
type BlogComponentProps = {
  blogComponent: ReactElement; // ReactElement represents any JSX element
};

const BlogMargins = styled("div")(({ theme }) => ({
  // margin:"32px 0 0 0",
  // [theme.breakpoints.up("lg")]: {
  //   maxWidth: "800px",
  //   margin: "auto",
  // },
}));
const BlogComponent: React.FC<BlogComponentProps> = ({ blogComponent }) => {
  const theme = useTheme();
  return <BlogMargins>
       <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        {blogComponent}
        </Paper>
    </Container>
  </BlogMargins>;
};

export default BlogComponent;