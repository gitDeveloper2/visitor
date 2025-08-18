"use client";
import React from "react";
import { StyledSectionGrid } from "../layout/Spacing";
import { Grid, useTheme } from "@mui/material";
import BlogComponent from "./BlogContentOld";
import { 
  replaceTags 
} from "../../../utils/transformers/htmlProcessing" ;
import { BibliographyState } from "../../../hooks/useBibliography";
import { AuthorProfile } from "../../../types/Author";
import { FAQ } from "../../../libs/faqReducer";

export interface RelatedPage {
  url: string;
  title: string;
  meta_description?: string; // Optional meta description
  keywords?: string[];       // Optional array of keywords
}

export interface RelatedPagesDocument {
  page: string;
  relatedPages: RelatedPage[];
}

export interface Dates{
  created:string;
  modified:string;
}

export interface Metadata {
  dates?: {
    created?: string;
    modified?: string;
  };
  tags?: string;
}

interface BloogComponentContainerProps {
  type?:"news"|"blog";
  parentPath?: string; // Made optional since it's not used
  refs:BibliographyState;
  relatedPages:RelatedPage[];
  thisPagePath?: string; // Made optional since it's not used
  content: string;
  url:string;
  author:AuthorProfile;
  faqs:FAQ[];
  metadata?: Metadata;
}

const BlogComponentContainer: React.FC<BloogComponentContainerProps> = ({
  relatedPages,
  content,
  refs,
  url,
  author,
  faqs,
  type,
  metadata
}) => {
  const theme = useTheme();
  const newContent = replaceTags(content, type, metadata, author.name, url);

  return (
    <StyledSectionGrid theme={theme} container gap={1} y16>
      <Grid item xs={12}>
        <BlogComponent 
          type={type} 
          relatedPages={relatedPages}
          blogComponent={<>{newContent}</>}
          refs={refs}
          url={url}
          author={author}
          faqs={faqs}
        />
      </Grid>
    </StyledSectionGrid>
  );
};

export default BlogComponentContainer;
