import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  Collapse,
  Container,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Code, Menu, X } from "lucide-react";
import { commonStyles } from "@/utils/themeUtils";
import ThemeToggle from "./ThemeToggle";

// === Gradient Icon Background ===
const GradientIconBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: theme.shape.borderRadius,
  background: theme.custom.gradients.primary,
}));

// === Gradient Text (like Tailwind bg-clip-text) ===
const GradientText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  background: theme.custom.gradients.primary,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

// === Styled Navigation Link ===
const NavLink = styled("a")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  textDecoration: "none",
  transition: "color 0.3s",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const links = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "#tools" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about-us" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 2, px: 2 }}>
          {/* === Logo and Brand === */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <GradientIconBox>
              <Code size={24} color="#fff" />
            </GradientIconBox>
            <GradientText>BasicUtils</GradientText>
          </Box>

          {/* === Desktop Navigation === */}
          {isDesktop && (
            <Box display="flex" alignItems="center" gap={4}>
              {links.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </Box>
          )}

          {/* === CTA and Theme Toggle === */}
          <Box display="flex" alignItems="center" gap={2}>
            <ThemeToggle />
            {isDesktop ? (
              <Button
                size="large"
                sx={{
                  ...commonStyles.gradientButton(theme),
                  px: 3,
                }}
              >
                Get Started
              </Button>
            ) : (
              <IconButton
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                sx={{
                  color: theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}20`,
                  },
                }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* === Mobile Menu === */}
        {!isDesktop && (
          <Collapse in={isMenuOpen}>
            <Box
              sx={{
                borderTop: `1px solid ${theme.custom.glass.border}`,
                backgroundColor: theme.custom.glass.background,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <Box sx={{ py: 2, px: 2 }}>
                {links.map((link) => (
                  <Box
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      display: "block",
                      py: 1.5,
                      px: 2,
                      color: theme.palette.text.primary,
                      textDecoration: "none",
                      borderRadius: theme.shape.borderRadius,
                      transition: "background-color 0.2s",
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}20`,
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                ))}
                <Button
                  fullWidth
                  size="large"
                  sx={{
                    ...commonStyles.gradientButton(theme),
                    mt: 2,
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Box>
          </Collapse>
        )}
      </Container>
    </AppBar>
  );
};

export default Header;
