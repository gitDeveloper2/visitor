import { Box, Button, Popover, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useState, MouseEvent } from "react";

interface SmartScrollableLabelRowProps {
  children: ReactNode[];
}

export function ScrollableLabelRow({ children }: SmartScrollableLabelRowProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const maxVisible = isMobile ? 2 : 3;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const visible = children.slice(0, maxVisible);
  const hidden = children.slice(maxVisible);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        sx={{
          margin: "0 32px 0 84px",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          maxHeight: 48,
          px: 2,
          py: 0.5,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {visible}
        {hidden.length > 0 && (
          <Button
            size="small"
            onClick={handleClick}
            sx={{ minWidth: 0, px: 1, fontSize: 12 }}
          >
            +{hidden.length} more
          </Button>
        )}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            p: 2,
            maxWidth: { xs: '90vw', sm: 400 },
            width: { xs: '90vw', sm: 'auto' },
            boxSizing: "border-box",
            overflowWrap: "break-word",
          },
        }}
        
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          Additional labels
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {hidden}
        </Box>
      </Popover>
    </>
  );
}
