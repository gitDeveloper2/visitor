import { Box, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import html2canvas from "html2canvas";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { TwitterShareButton } from "@/features/shared/components/TwitterShare";
import FacebookShareButton from "@/features/shared/components/FacebookShare";



export function ShareActions({
  chartRef,
  npmChartRef,
  githubChartRef,
}: {
  chartRef: React.RefObject<HTMLDivElement | null>;
  npmChartRef: React.RefObject<HTMLDivElement | null>;
  githubChartRef: React.RefObject<HTMLDivElement | null>;
}) {

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
  const embedUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/star-embed?${searchParams}`;
const shareMessage=`Compare GitHub stars and npm downloads for top packages. Visualize trends and optimize your dev workflow with NpmStars charts. \n\n`;
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const exportAsImage = async (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;

    // Hide the button
    const button = ref.current.querySelector(".export-button") as HTMLElement;
    if (button) button.style.display = "none";

    const canvas = await html2canvas(ref.current, {
      scale: 2,
      width: ref.current.offsetWidth,
      height: ref.current.scrollHeight,
    });

    // Restore the button
    if (button) button.style.display = "";

    const link = document.createElement("a");
    link.download = "chart-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Box className="export-button" sx={{ display: "flex", justifyContent: { md: "flex-end", xs: 'flex-end' }, mt: 0, }}>
      <Tooltip title="Share Options">
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={handleClick}
          aria-controls={open ? "share-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          Share Charts
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
            py: 0.5, // reduce vertical padding
            px: 0,   // remove horizontal padding
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: (theme) => theme.shadows[8],
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <MenuItem sx={{ py: 0.5, px: 2,m:1 }} onClick={() => copyToClipboard(fullUrl)}>Copy Share Link</MenuItem>
        <MenuItem sx={{ py: 0.5, px: 2,m:1 }} onClick={() => exportAsImage(chartRef)}>Download Combined charts as Image</MenuItem>
        <MenuItem sx={{ py: 0.5, px: 2,m:1 }} onClick={() => exportAsImage(npmChartRef)}>Download npm chart as Image</MenuItem>
        <MenuItem sx={{ py: 0.5, px: 2,m:1 }} onClick={() => exportAsImage(githubChartRef)}>Download GitHub chart as Image</MenuItem>

        <MenuItem sx={{ py: 0.5, px: 2,m:1 }} disableRipple>
          <FacebookShareButton message="Hello guys" url={fullUrl} />
        </MenuItem>
        <MenuItem sx={{ py: 0.5, px: 2,m:1 }} disableRipple>
          <TwitterShareButton
            url={fullUrl}
            text={shareMessage}
            hashtags={[
              "GitHub",
              "npm",
              "DevTools",
              "WebDevelopment",
              "Chart",
              "Analytics",
              "GitHubTrends",
              "npmTrends"
            ]}
            
    />
        </MenuItem>
      </Menu>

    </Box>
  );
}
