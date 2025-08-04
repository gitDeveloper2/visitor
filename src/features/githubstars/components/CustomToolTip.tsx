import utils from "@/features/githubstars/utils";
import { TooltipProps } from "recharts";
import { Avatar, Box, Typography } from "@mui/material";

export function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;

  return (
    <Box sx={{ p: 1, backgroundColor: "#fff", border: "1px solid #ccc" }}>
     <Typography variant="subtitle2">
  {typeof label === "number"
    ? new Date(label).toLocaleDateString()
    : String(label)}
</Typography>

      {payload.map((entry) => {
        const repo = entry.name ?? "";
        const logoUrl = utils.getRepoLogoUrl(repo);
        return (
          <Box key={repo} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {logoUrl && (
              <Avatar src={logoUrl} sx={{ width: 20, height: 20, mr: 1 }} />
            )}
            <Typography variant="body2">
              {repo}: {entry.value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
