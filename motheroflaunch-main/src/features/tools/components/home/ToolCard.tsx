import { UITool } from "@features/tools/models/Tools";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  Paper,
} from "@mui/material";
import Link from "next/link";
import VoteButton from "../VoteButton";
import { useVotesContext } from "@features/providers/VotesContext";
import { Category, Tag } from "@mui/icons-material";
import StyleIcon from '@mui/icons-material/Style'; // ✅ at the top

type Props = {
  tool: UITool;
};

export default function ToolCard({ tool }: Props) {
  const votes = useVotesContext();
  const votingFlushed = tool.votingFlushed ?? false;
  const votingDurationHours = tool.votingDurationHours ?? 24;

  const votingOver =
    votingFlushed ||
    (tool.launchDate &&
      Date.now() >
        new Date(tool.launchDate).getTime() + votingDurationHours * 3600_000);

  return (
    <Paper
      elevation={0}
      sx={{
        px: 2,
        py: 2,
        borderRadius: 2,
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href={`/tools/${tool._id}`} // you may want to switch to `/tools/${tool.slug}`
          passHref
          style={{
            textDecoration: 'none',
            color: 'inherit',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {tool.logo?.url && (
            <Avatar
              src={tool.logo.url}
              alt={tool.name}
              sx={{ width: 32, height: 32, borderRadius: 1 }}
            />
          )}

          <Box ml={1.5}>
            <Typography variant="body1" fontWeight={500}>
              {tool.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {tool.tagline}
            </Typography>

            {/* ✅ Show category chip */}
            

            <Box mt={0.5} display="flex" gap={1} flexWrap="wrap" alignItems="center">
  {/* Category – styled text+icon */}
  {tool.category && typeof tool.category === 'object' && 'name' in tool.category && (
    
    <Box
      component="span"
      display="inline-flex"
      alignItems="center"
      gap={0.5}
      sx={{
        fontSize: '0.85rem',
        fontWeight: 500,
        color: 'text.secondary',
      }}
    >
      <StyleIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', opacity: 0.7 }} />
      {tool.category.name}
    </Box>
  )}

  {/* Separator */}
  {tool.category && tool.tags && (
    <Typography
      component="span"
      sx={{ mx: 0.5, fontSize: '0.8rem', color: 'text.disabled' }}
    >
      &bull;
    </Typography>
  )}

  {/* Tags */}
  {tool.tags &&
    tool.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag, i) => (
        <Chip
          key={i}
          icon={<Tag sx={{ fontSize: 16 }} />}
          label={tag}
          size="small"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
      ))}
</Box>




          </Box>
        </Link>

        <Tooltip
          title={
            votingOver
              ? votingFlushed
                ? 'Voting was closed early for this tool.'
                : `Voting ended ${votingDurationHours} hours after launch.`
              : 'Vote for this tool!'
          }
        >
          <Box ml={2}>
            <VoteButton
              toolId={tool._id}
              initialVotes={tool.stats.votes}
              launchDate={
                tool.launchDate
                  ? new Date(tool.launchDate).toISOString()
                  : ''
              }
              votingFlushed={votingFlushed}
              votingDurationHours={votingDurationHours}
              votes={votes}
            />
          </Box>
        </Tooltip>
      </Box>
    </Paper>
  );
}
