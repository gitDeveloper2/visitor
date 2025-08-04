import React from "react";
import { Box, Typography,Paper } from "@mui/material";

interface SubtopicProps {
  title: string;
  content: string;
}

export const Subtopic: React.FC<SubtopicProps> = ({ title, content }) => (
  <Box mb={2}>
    <Typography variant="h6" component="h3" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2">{content}</Typography>
  </Box>
);


interface ProductInfoProps {
  title: { main: string; description: string };
  subtopics: { title: string; content: string }[];
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ title, subtopics }) => (
  <Paper elevation={0} sx={{ p: 3 }}>
    <Typography variant="h5" component="h2" gutterBottom>
      {title.main}
    </Typography>
    <Typography variant="body2" gutterBottom>
      {title.description}
    </Typography>
    {subtopics.map((subtopic, index) => (
      <Subtopic key={index} title={subtopic.title} content={subtopic.content} />
    ))}
  </Paper>
);
