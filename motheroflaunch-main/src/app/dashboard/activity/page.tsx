'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';

interface Tool {
  _id: string;
  name: string;
  tagline?: string;
  votes: number;
  createdAt: string;
}

interface VoteRecord {
  tool: Tool;
  createdAt: string;
}

export default function UpvotedToolsTimeline() {
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUpvotedTools() {
      try {
        const res = await fetch('/api/tools/upvoted');
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to fetch');
        const data=json.data
        console.log(data)
        setVotes(data); // Expecting array of { tool, votedAt }
      } catch (err: any) {
        setError(err.message || 'Error fetching upvoted tools');
      } finally {
        setLoading(false);
      }
    }

    fetchUpvotedTools();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Upvote Timeline
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && votes.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mt: 3 }}>
          You haven’t upvoted any tools yet.
        </Typography>
      )}

      {!loading && votes.length > 0 && (
        <Timeline position="alternate">
          {votes.map((tool, index) => (
  <TimelineItem key={index}>
    <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right">
      {/* Since you don’t have votedAt from backend, use tool.createdAt as fallback */}
      <Typography variant="body2" color="text.secondary">
        {new Date(tool.createdAt).toLocaleString()}
      </Typography>
    </TimelineOppositeContent>

    <TimelineSeparator>
      <TimelineDot color="primary" />
      {index < votes.length - 1 && <TimelineConnector />}
    </TimelineSeparator>

    <TimelineContent sx={{ py: 2 }}>
      <Card variant="outlined" sx={{ maxWidth: 400 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              You upvoted:
            </Typography>
            <Typography variant="h6">{tool.tool.name}</Typography>
            {tool.tool.tagline && (
              <Typography variant="body2" color="text.secondary">
                {tool.tool.tagline}
              </Typography>
            )}
            {/* <Typography variant="body2">
              Total votes: <strong>{tool.tool.?.votes ?? 0}</strong>
            </Typography> */}
          </Stack>
        </CardContent>
      </Card>
    </TimelineContent>
  </TimelineItem>
))}

        </Timeline>
      )}
    </Box>
  );
}
