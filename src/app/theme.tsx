"use client"
import * as React from 'react';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

// Augment MUI's TypographyProps to include custom variants
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1Bold: true;
    MainTitle: true;
    sectionTitle: true;
    PageTitle: true;
  }
}

// Extend TypographyOptions to include custom typography variants
interface ExtendedTypographyOptions extends TypographyOptions {
  h1Bold: React.CSSProperties;
  MainTitle: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  PageTitle: React.CSSProperties;
}

// Create theme function that accepts mode parameter
export const createAppTheme = (mode: "light" | "dark") => {
  // Light theme colors
  const lightColors = {
    primary: {
      main: "hsl(263 70% 50%)",
      light: "hsl(263 70% 60%)",
      dark: "hsl(263 70% 40%)",
    },
    secondary: {
      main: "hsl(220 70% 50%)",
      light: "hsl(220 70% 60%)",
      dark: "hsl(220 70% 40%)",
    },
    background: {
      default: "hsl(0 0% 100%)",
      paper: "hsla(0 0% 100% 0.8)",
    },
    text: {
      primary: "hsl(240 10% 3.9%)",
      secondary: "hsl(240 5% 34.8%)",
    },
    divider: "hsl(240 5% 84.9%)",
    action: {
      hover: "hsl(240 5% 96.1%)",
      selected: "hsl(240 5% 96.1%)",
    },
  };

  // Dark theme colors
  const darkColors = {
    primary: {
      main: "hsl(263 70% 50%)",
      light: "hsl(263 70% 60%)",
      dark: "hsl(263 70% 40%)",
    },
    secondary: {
      main: "hsl(220 70% 50%)",
      light: "hsl(220 70% 60%)",
      dark: "hsl(220 70% 40%)",
    },
    background: {
      default: "hsl(240 10% 3.9%)",
      paper: "hsla(240 10% 3.9% 0.8)",
    },
    text: {
      primary: "hsl(0 0% 98%)",
      secondary: "hsl(240 5% 64.9%)",
    },
    divider: "hsl(240 3% 15%)",
    action: {
      hover: "hsl(240 5% 15%)",
      selected: "hsl(240 5% 15%)",
    },
  };

  const colors = mode === "light" ? lightColors : darkColors;

  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      text: colors.text,
      divider: colors.divider,
      action: colors.action,
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "3.5rem",
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
          color: colors.text.primary,

      },
      h2: {
        fontSize: "2.75rem",
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.01em",
        color: colors.text.primary,

      },
      h3: {
        fontSize: "2.25rem",
        fontWeight: 700,
        lineHeight: 1.2,
        color: colors.text.primary,
      },
      h4: {
        fontSize: "1.875rem",
        fontWeight: 600,
        lineHeight: 1.3,
        color: colors.text.primary,
      },
      h5: {
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.text.primary,
      },
      h6: {
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.text.primary,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
        color: colors.text.primary,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
        color: colors.text.secondary,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
      // Custom typography settings
      h1Bold: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 800,
        fontSize: '3.5rem',
        lineHeight: 1.1,
        color: colors.text.primary,
        marginTop: '20px',
        marginBottom: '2rem',
        letterSpacing: '-0.02em',
      },
      MainTitle: {
        fontSize: '3rem',
        fontWeight: 800,
        marginBottom: '1.5rem',
        color: colors.text.primary,
        letterSpacing: '-0.01em',
      },
      sectionTitle: {
        fontSize: '2.25rem',
        fontWeight: 700,
        marginBottom: '1.25rem',
        color: colors.text.primary,
        letterSpacing: '-0.01em',
      },
      PageTitle: {
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: colors.text.primary,
        letterSpacing: '0em',
      },
      caption: {
        fontSize: '0.875rem',
        color: colors.text.secondary,
      },
    } as ExtendedTypographyOptions,
    shadows: [
      "none",
      "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
      "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
      "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
      "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
      "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
      "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
      "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
      "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
      "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
      "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
      "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
      "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
      "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
      "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
      "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
      "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
      "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
      "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
      "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
      "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
      "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
      "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
      "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
      "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" 
              ? "hsla(255, 255, 255, 0.8)" 
              : "hsla(240, 10%, 3.9%, 0.8)",
            borderBottom: `1px solid ${mode === "light" ? "hsla(263, 70%, 50%, 0.1)" : "hsla(263, 70%, 50%, 0.2)"}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" 
              ? "hsl(263 70% 50% / 0.1)" 
              : "hsl(263 70% 50% / 0.2)",
            color: "hsl(263 70% 50%)",
            borderColor: mode === "light" 
              ? "hsl(263 70% 50% / 0.2)" 
              : "hsl(263 70% 50% / 0.3)",
            "&:hover": {
              backgroundColor: mode === "light" 
                ? "hsl(263 70% 50% / 0.2)" 
                : "hsl(263 70% 50% / 0.3)",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: mode === "light" 
                ? "hsl(263 70% 50% / 0.1)" 
                : "hsl(263 70% 50% / 0.1)",
            },
          },
        },
      },
    },
    // Custom theme extensions for design tokens
    custom: {
      gradients: {
        primary: "linear-gradient(135deg, hsl(263 70% 50%), hsl(220 70% 50%))",
        secondary: "linear-gradient(135deg, hsl(220 70% 50%), hsl(280 70% 50%))",
        hero: "linear-gradient(135deg, hsl(263 70% 50%) 0%, hsl(220 70% 50%) 50%, hsl(280 70% 50%) 100%)",
      },
      glass: {
        background: mode === "light" 
          ? "hsla(255, 255, 255, 0.8)" 
          : "hsla(240, 10%, 3.9%, 0.8)",
        border: mode === "light" 
          ? "hsla(263, 70%, 50%, 0.1)" 
          : "hsla(263, 70%, 50%, 0.2)",
      },
      shadows: {
        elegant: mode === "light"
          ? "0 25px 50px -12px hsl(263 70% 50% / 0.15)"
          : "0 25px 50px -12px hsl(263 70% 50% / 0.25)",
        neon: "0 0 20px hsl(263 70% 50% / 0.3)",
      },
      animations: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
    },
  } as ThemeOptions);
};

// Default theme (dark mode)
export const theme = createAppTheme("dark");

// Type declarations for custom theme properties
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: { primary: string; secondary: string; hero: string; };
      glass: { background: string; border: string; };
      shadows: { elegant: string; neon: string; };
      animations: { float: string; glow: string; };
    };
  }
  interface ThemeOptions {
    custom?: {
      gradients?: { primary?: string; secondary?: string; hero?: string; };
      glass?: { background?: string; border?: string; };
      shadows?: { elegant?: string; neon?: string; };
      animations?: { float?: string; glow?: string; };
    };
  }
}








