import { FormControl, Input, InputLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import { AddPageProps } from './types';

const MainContentSection:React.FC<AddPageProps> = ({control,errors}) => {
    return (
        <>
         <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel htmlFor="title">Title</InputLabel>
          <Input
            id="title"
            name="title"
            {...control.register("title", { required: "Title is required" })}
            required
          />
          {errors.title && (
            <Typography variant="body2" color="error">
              {errors.title.message}
            </Typography>
          )}
        </FormControl>
        <TextField
          id="content"
          name="content"
          label="Content"
          multiline
          defaultValue={'<p>test</>'}
          rows={4}
          {...control.register("content", { required: "Content is required" })}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        {errors.content && (
          <Typography variant="body2" color="error">
            {errors.content.message}
          </Typography>
        )}
        </>
    );
}

export default MainContentSection;
