import { TextField, Box, InputAdornment, Typography, IconButton, Stack } from '@mui/material';
import { useFormContext, useWatch, useController } from 'react-hook-form';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export default function ColorField() {
  const { control, formState: { errors } } = useFormContext();

  const {
    field: { value: color = '', onChange, ...rest },
  } = useController({ name: 'color', control });

  const isHex = /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
  const remaining = 7 - color.length;

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Color (hex)"
          placeholder="#3f51b5"
          fullWidth
          value={color}
          onChange={onChange}
          error={!!errors.color}
          helperText={
            typeof errors.color?.message === 'string'
              ? errors.color?.message
              : !color
              ? 'Optional'
              : isHex
              ? 'Valid hex color'
              : 'Invalid hex format (e.g. #123abc)'
          }
          
          InputProps={{
            endAdornment: isHex ? (
              <InputAdornment position="end">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: color,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </InputAdornment>
            ) : undefined,
          }}
          {...rest}
        />

        {/* Native Color Picker */}
        <input
          type="color"
          value={isHex ? color : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 40,
            height: 40,
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
          title="Pick a color"
        />
      </Stack>

      <Box display="flex" justifyContent="space-between" mt={0.5}>
        <Typography variant="caption" color={remaining < 0 ? 'error' : 'text.secondary'}>
          {remaining} characters remaining
        </Typography>
        {color.length > 7 && (
          <Typography variant="caption" color="error">
            Too long for hex
          </Typography>
        )}
      </Box>
    </Box>
  );
}
