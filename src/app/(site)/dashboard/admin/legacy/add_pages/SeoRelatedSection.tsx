import { TextField } from '@mui/material';
import React from 'react';
import { AddPageProps } from './types';

const SeoRelatedSection:React.FC<AddPageProps> = ({control,errors}) => {
    return (
       <>
               <TextField
          id="keywords"
          name="keywords"
          label="Keywords"
          {...control.register("keywords")}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="meta_description"
          name="meta_description"
          label="Meta Description"
          {...control.register("meta_description")}
          fullWidth
          sx={{ mb: 2 }}
        />
       
      

        <TextField
          id="relatedPages"
          name="relatedPages"
          label="Related Pages (comma-separated URLs)"
          {...control.register("relatedPages")}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="e.g., page1-url,page2-url"
        />
       </>
    );
}

export default SeoRelatedSection;
