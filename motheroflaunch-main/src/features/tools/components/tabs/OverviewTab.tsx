import { Box, Typography } from '@mui/material';
import Carousel from '../Carousel';
import { UITool } from '@features/tools/models/Tools';

export default function OverviewTab({ tool }: { tool:UITool }) {
  return (
    <Box>
      <Carousel screenshots={tool.screenshots || []} />
      <Typography
  variant="body1"
  mt={2}
  sx={{
    whiteSpace: 'pre-wrap',  // preserve line breaks and spacing
    wordBreak: 'break-word', // wrap long words if needed
  }}
>
  {tool.description}
</Typography>

    </Box>
  );
}
