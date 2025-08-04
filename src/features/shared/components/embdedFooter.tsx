import { Box, Link, Typography } from "@mui/material";

export default function EmbedFooter(){
    return <footer>
    <Box
      sx={{
        mt: 'auto',
        textAlign: "center",
        fontSize: "12px",
        color: "text.secondary",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" color="inherit">
        <Link
          href="https://basicutils.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mt: 2,
            textDecoration: "none",
            color: "primary.main",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Powered by BasicUtils
        </Link>
      </Typography>
    </Box>
  </footer>
}