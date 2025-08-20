// app/categories/[slug]/page.tsx
import ToolCardClientWrapper from '@features/tools/components/ToolCardWrapper';
import { getPaginatedTools } from '@features/tools/service/toolService';
import { Box, Typography, Divider, Stack } from '@mui/material';
import startCase from 'lodash/startCase';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryToolsPage({ params }: Props) {
  const { slug } = await params;
  const { data: tools } = await getPaginatedTools(20, undefined, '', undefined, slug);

  return (
    <Box >
      <Typography variant="h5" fontWeight={600} mb={2}>
        {startCase(slug)}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {tools.map((tool) => (
          <ToolCardClientWrapper key={tool._id} tool={tool} />
        ))}
      </Stack>
    </Box>
  );
}
