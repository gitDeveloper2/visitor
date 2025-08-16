import { TextField } from '@mui/material';
import React from 'react';
import { AddPageProps } from './types';

const ImageSection:React.FC<AddPageProps> = ({control,errors}) => {
    return (
        <>
           <TextField
          id="image_url"
          name="image_url"
          label="Image URL"
          {...control.register("image_url")}
          fullWidth
          sx={{ mb: 2 }}
        />
           <TextField
          id="image_caption"
          name="image_caption"
          label="Image Caption"
          {...control.register("image_caption")}
          fullWidth
          sx={{ mb: 2 }}
        />
           <TextField
          id="image_attribution"
          name="image_attribution"
          label="Image Attribution"
          {...control.register("image_attribution")}
          fullWidth
          sx={{ mb: 2 }}
        />
        </>
    );
}

export default ImageSection;
