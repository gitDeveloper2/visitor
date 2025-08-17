"use client";

import { Box, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import html2canvas from "html2canvas";
import { usePathname, useSearchParams } from "next/navigation";

export function ShareActions({ chartRef }: { chartRef: React.RefObject<HTMLDivElement | null> }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}?${searchParams}`;
  // const embedUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/embed?${searchParams}`;
  // const markdownImage = `![GitHub Stars Chart](${process.env.NEXT_PUBLIC_SITE_URL}/chart.png?${searchParams})`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const exportAsImage = async () => {
    if (!chartRef.current) return;
  
    // Hide the button
    const button = chartRef.current.querySelector(".export-button") as HTMLElement;
    if (button) button.style.display = "none";
  
    const canvas = await html2canvas(chartRef.current, {
      scale: 2,
      width: chartRef.current.offsetWidth,
      height: chartRef.current.scrollHeight,
    });
  
    // Restore the button
    if (button) button.style.display = "";
  
    const link = document.createElement("a");
    link.download = "star-history.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Box className="export-button" sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
      <Tooltip title="Share Options">
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={handleClick}
          aria-controls={open ? "share-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          Share Chart
        </Button>
      </Tooltip>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: (theme) => theme.shadows[8],
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {/* <MenuItem onClick={() => copyToClipboard(`<iframe src=\"${embedUrl}\" width=\"100%\" height=\"100%\"></iframe>`) }>Copy Embed Code</MenuItem> */}
        {/* <MenuItem onClick={() => copyToClipboard(markdownImage)}>Copy Markdown Image</MenuItem> */}
        <MenuItem onClick={() => copyToClipboard(fullUrl)}>Copy Share Link</MenuItem>
        <MenuItem onClick={exportAsImage}>Download as Image</MenuItem>
      </Menu>
    </Box>
  );
}
