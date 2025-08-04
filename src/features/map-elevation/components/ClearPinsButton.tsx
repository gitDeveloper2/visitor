import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ClearPinsButtonProps {
  onClear: () => void;
  disabled?: boolean;
}

export default function ClearPinsButton({ onClear, disabled }: ClearPinsButtonProps) {
  return (
    <Button
    size="small"
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={onClear}
      disabled={disabled}
      sx={{mb:2}}
    >
      Clear Map
    </Button>
  );
}
