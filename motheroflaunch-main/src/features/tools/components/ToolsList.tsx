'use client';

import { useEffect, useState } from 'react';
import { Button, Box, Stack, Typography } from '@mui/material';
import ToolCard from './home/ToolCard';
import { UITool } from '../models/Tools';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
type Props = {
  initialTools: UITool[];
  initialCursor: string | null;
  period: 'daily' | 'weekly' | 'monthly';
  title: string;
};

export default function PaginatedToolsList({
  initialTools,
  initialCursor,
  period,
  title,
}: Props) {
  const [tools, setTools] = useState<UITool[]>(initialTools);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(Boolean(initialCursor));


  



  async function loadMore() {
    if (!cursor) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/tools?period=${period}&size=2&cursor=${cursor}`);
      const json = await res.json();

      

      setTools((prev) => [...prev, ...json.data]);
      setCursor(json.nextCursor);
      setHasNext(json.hasNextPage);
    } catch (err) {
      console.error("Error loading more tools:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box mb={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {title}
      </Typography>

      <Stack spacing={2}>
        {tools.map((tool) => (
          <ToolCard key={tool._id} tool={tool} />
        ))}
      </Stack>

      {hasNext && (
        <Box mt={2}>
        <Button
  variant="text"
  onClick={loadMore}
  disabled={loading}
  endIcon={
    loading ? (
      <CircularProgress size={20} color="inherit" />
    ) : (
      <ExpandMoreIcon />
    )
  }
  sx={{
    borderRadius: 3,
    px: 4,
    py: 1.5,
    fontWeight: 600,
    fontSize: "1rem",
    textTransform: "none",
    borderColor: "primary.main",
    color: "primary.main",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "primary.main",
      color: "white",
      opacity: 0.65, 
    },
    "&:disabled": {
      color: "grey.400",
      borderColor: "grey.300",
    },
  }}
>
  {loading ? "Loading..." : "Load More"}
  </Button>

        </Box>
      )}
    </Box>
  );
}
