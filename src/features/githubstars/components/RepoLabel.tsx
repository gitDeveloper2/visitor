import { Avatar, Box, SxProps, Theme, Typography } from "@mui/material";
import { useRepoLogoUrl } from "@/features/githubstars/hooks/useRepoLogoUrl";

export function RepoLabel({
  repoName,
  sx,
  color, // already passed in by parent
}: {
  repoName: string;
  sx?: SxProps<Theme>;
  color?: string;
}) {
  const { logoUrl } = useRepoLogoUrl(repoName);

  return (
    <Box
  sx={{
    display: "inline-flex", // 👈 ensures consistent alignment inside flex row
    alignItems: "center",
    lineHeight: 1, // 👈 prevent vertical misalignment
    minWidth: 0,
    ...sx,
  }}
>
  {logoUrl && (
    <Box>


    <Avatar
      src={logoUrl}
      sx={{
        width: 20,
        height: 20,
        mr: 1,
        flexShrink: 0,
        fontSize: 12, // in case there's fallback text in avatar
      }}
    />
    </Box>
  )}
  {/* <Box  sx={{
    backgroundColor:'brown',
    
  }}> */}
  <Typography
    variant="body2"
    sx={{
      margin:'auto',
      lineHeight: 1, // 👈 match Box line-height
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: 120,
      mr: 2,
      color: color || "inherit",
      fontWeight: 600,
      display: "inline-block",
      verticalAlign: "middle", // 👈 ensures correct inline alignment if wrapped
    }}
    title={repoName}
  >
    {repoName}
  </Typography>
  {/* </Box> */}
</Box>

  );
}


