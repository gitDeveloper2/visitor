import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  IconButton,
  Stack,
  Collapse,
  Fade,
} from "@mui/material";
import { ChevronDown, ChevronUp, List } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles, getShadow } from "@/utils/themeUtils";

interface TableOfContentsProps {
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const theme = useTheme();

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveId(null);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 100,
        right: 24,
        width: 280,
        zIndex: 1000,
        display: { xs: "none", lg: "block" },
      }}
    >
      <Card
        sx={{
          ...getGlassStyles(theme),
          boxShadow: getShadow(theme, 'elegant'),
          maxHeight: "calc(100vh - 200px)",
          overflow: "hidden",
        }}
      >
        <CardHeader
          sx={{
            pb: 1,
            "& .MuiCardHeader-content": { margin: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <List style={{ width: 16, height: 16, color: theme.palette.primary.main }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Table of Contents
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}20`,
                },
              }}
            >
              {isExpanded ? (
                <ChevronUp style={{ width: 16, height: 16 }} />
              ) : (
                <ChevronDown style={{ width: 16, height: 16 }} />
              )}
            </IconButton>
          </Box>
        </CardHeader>

        <Collapse in={isExpanded}>
          <CardContent sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={1}>
              <Button
                variant="text"
                size="small"
                onClick={scrollToTop}
                sx={{
                  justifyContent: "flex-start",
                  color: activeId === null ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontWeight: activeId === null ? 600 : 400,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                Overview
              </Button>

              {headings.map((heading) => (
                <Button
                  key={heading.id}
                  variant="text"
                  size="small"
                  onClick={() => handleHeadingClick(heading.id)}
                  sx={{
                    justifyContent: "flex-start",
                    pl: heading.level * 2,
                    color: activeId === heading.id ? theme.palette.primary.main : theme.palette.text.secondary,
                    fontWeight: activeId === heading.id ? 600 : 400,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}10`,
                    },
                  }}
                >
                  {heading.text}
                </Button>
              ))}
            </Stack>
          </CardContent>
        </Collapse>
      </Card>

      {/* Mobile TOC Button */}
      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        <Fade in={!isExpanded}>
          <IconButton
            onClick={() => setIsExpanded(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.custom.glass.border}`,
              boxShadow: getShadow(theme, 'elegant'),
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: "white",
              },
            }}
          >
            <List style={{ width: 20, height: 20 }} />
          </IconButton>
        </Fade>
      </Box>
    </Box>
  );
};

export default TableOfContents;