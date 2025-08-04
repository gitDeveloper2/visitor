import { Typography } from '@mui/material';
import { useTheme , styled} from  '@mui/material/styles';
export const Capitalize=(text:string)=>{

    return text.toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

export const WrappingTypography = styled(Typography)(({ theme }) => ({
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  }));