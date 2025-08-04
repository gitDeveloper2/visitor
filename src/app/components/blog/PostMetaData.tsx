import { FC } from "react";
import {
  Box,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import ShareIcon from "@mui/icons-material/Share";
import dayjs from "dayjs";
import { getRandomColor } from "@components/articlecard/utils";

type PostMetaProps = {
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  author?: string;
  shareUrl?: string;
};

const PostMeta: FC<PostMetaProps> = ({
  createdAt,
  updatedAt,
  tags = [],
  author,
  shareUrl,
}) => {
  const formattedCreated = createdAt
    ? dayjs(createdAt).format("MMM D, YYYY")
    : null;

  const formattedUpdated = updatedAt
    ? dayjs(updatedAt).format("MMM D, YYYY")
    : null;

  const showCreated = formattedCreated && formattedCreated !== formattedUpdated;
  const showUpdated = formattedUpdated;

  const handleCopy = () => {
    if (shareUrl) navigator.clipboard.writeText(shareUrl);
  };

  return (
    <Box component="section" sx={{ mb: 2 }}>
      {(showCreated || showUpdated || author) && (
        <Box sx={{ mb: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {showCreated && (
              <p style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                Published: {formattedCreated}
              </p>
            )}
            {!showCreated && showUpdated && (
              <p style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                Updated: {formattedUpdated}
              </p>
            )}
          </Stack>

          {author && (
            <p style={{ fontSize: "1.1rem", marginTop: "8px", color: "#6c757d" }}>
              By: {author}
            </p>
          )}
        </Box>
      )}

      {tags.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          {tags.slice(0, 10).map((tag) => (
            <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" color={getRandomColor()} />
          ))}
        </Stack>
      )}

      {shareUrl && (
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="share on Facebook"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="share on Twitter"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="copy link" onClick={handleCopy}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default PostMeta;
