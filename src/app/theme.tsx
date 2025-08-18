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
      paper: "hsl(0 0% 100%)",
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
    success: {
      main: "hsl(142 70% 45%)",
      light: "hsl(142 70% 55%)",
      dark: "hsl(142 70% 35%)",
    },
    warning: {
      main: "hsl(38 90% 55%)",
      light: "hsl(38 90% 65%)",
      dark: "hsl(38 90% 45%)",
    },
    info: {
      main: "hsl(200 90% 50%)",
      light: "hsl(200 90% 60%)",
      dark: "hsl(200 90% 40%)",
    },
    error: {
      main: "hsl(0 75% 55%)",
      light: "hsl(0 75% 65%)",
      dark: "hsl(0 75% 45%)",
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
      paper: "hsl(240 10% 3.9%)",
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
    success: {
      main: "hsl(142 70% 45%)",
      light: "hsl(142 70% 55%)",
      dark: "hsl(142 70% 35%)",
    },
    warning: {
      main: "hsl(38 90% 55%)",
      light: "hsl(38 90% 65%)",
      dark: "hsl(38 90% 45%)",
    },
    info: {
      main: "hsl(200 90% 50%)",
      light: "hsl(200 90% 60%)",
      dark: "hsl(200 90% 40%)",
    },
    error: {
      main: "hsl(0 75% 55%)",
      light: "hsl(0 75% 65%)",
      dark: "hsl(0 75% 45%)",
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
      success: colors.success,
      warning: colors.warning,
      info: colors.info,
      error: colors.error,
      // AA large text 3.0, AA normal 4.5; default is 3. We raise to 4.5 for stronger contrast
      contrastThreshold: 4.5,
      tonalOffset: 0.15,
    },
    shape: {
      borderRadius: 3,
    },
    typography: {
      fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Outfit", "Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "3.5rem",
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: colors.text.primary,
      },
      h2: {
        fontFamily: '"Outfit", "Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "2.75rem",
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.01em",
        color: colors.text.primary,
      },
      h3: {
        fontFamily: '"Poppins", "Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "2.25rem",
        fontWeight: 700,
        lineHeight: 1.2,
        color: colors.text.primary,
      },
      h4: {
        fontFamily: '"Poppins", "Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "1.875rem",
        fontWeight: 600,
        lineHeight: 1.3,
        color: colors.text.primary,
      },
      h5: {
        fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.text.primary,
      },
      h6: {
        fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.text.primary,
      },
      body1: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "1rem",
        lineHeight: 1.6,
        color: colors.text.primary,
      },
      body2: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "0.875rem",
        lineHeight: 1.5,
        color: colors.text.secondary,
      },
      button: {
        fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        textTransform: "none",
        fontWeight: 600,
      },
      // Custom typography settings
      h1Bold: {
        fontFamily: '"Outfit", "Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 800,
        fontSize: '3.5rem',
        lineHeight: 1.1,
        color: colors.text.primary,
        marginTop: '20px',
        marginBottom: '2rem',
        letterSpacing: '-0.02em',
      },
      MainTitle: {
        fontFamily: '"Outfit", "Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '3rem',
        fontWeight: 800,
        marginBottom: '1.5rem',
        color: colors.text.primary,
        letterSpacing: '-0.01em',
      },
      sectionTitle: {
        fontFamily: '"Poppins", "Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '2.25rem',
        fontWeight: 700,
        marginBottom: '1.25rem',
        color: colors.text.primary,
        letterSpacing: '-0.01em',
      },
      PageTitle: {
        fontFamily: '"Poppins", "Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: colors.text.primary,
        letterSpacing: '0em',
      },
      caption: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            colorScheme: mode,
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': {
              outline: `3px solid ${colors.primary.main}`,
              outlineOffset: 3,
            },
          },
        },
      },
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
            fontWeight: 600,
            fontSize: '0.875rem',
            // Default chip styling - works in both themes
            '&.MuiChip-colorDefault': {
              backgroundColor: mode === 'light' 
                ? 'hsl(240 5% 96.1%)'  // Light grey background
                : 'hsl(240 5% 15%)',   // Dark grey background
              color: mode === 'light' 
                ? 'hsl(240 5% 34.8%)'  // Dark grey text
                : 'hsl(240 5% 64.9%)', // Light grey text
              borderColor: mode === 'light' 
                ? 'hsl(240 5% 84.9%)'  // Light border
                : 'hsl(240 3% 15%)',   // Dark border
            },
            // Filled chips with proper text contrast
            '&.MuiChip-colorSuccess.MuiChip-variantFilled': {
              backgroundColor: 'hsl(142 70% 45%)',
              color: 'white', // Always light text for dark green
              borderColor: 'hsl(142 70% 35%)',
            },
            '&.MuiChip-colorWarning.MuiChip-variantFilled': {
              backgroundColor: 'hsl(38 90% 55%)', 
              color: 'hsl(38 90% 15%)', // Dark text for light orange
              borderColor: 'hsl(38 90% 45%)',
            },
            '&.MuiChip-colorError.MuiChip-variantFilled': {
              backgroundColor: 'hsl(0 75% 55%)',
              color: 'white', // Always light text for dark red
              borderColor: 'hsl(0 75% 45%)',
            },
            '&.MuiChip-colorInfo.MuiChip-variantFilled': {
              backgroundColor: 'hsl(200 90% 50%)',
              color: 'white', // Always light text for dark blue
              borderColor: 'hsl(200 90% 40%)',
            },
            '&.MuiChip-colorPrimary.MuiChip-variantFilled': {
              backgroundColor: 'hsl(263 70% 50%)',
              color: 'white', // Always light text for dark purple
              borderColor: 'hsl(263 70% 40%)',
            },
            // Outlined chips - use theme-aware colors
            '&.MuiChip-colorSuccess.MuiChip-variantOutlined': {
              backgroundColor: 'transparent',
              color: mode === 'light' ? 'hsl(142 70% 25%)' : 'hsl(142 70% 55%)',
              borderColor: mode === 'light' ? 'hsl(142 70% 35%)' : 'hsl(142 70% 45%)',
            },
            '&.MuiChip-colorWarning.MuiChip-variantOutlined': {
              backgroundColor: 'transparent',
              color: mode === 'light' ? 'hsl(38 90% 35%)' : 'hsl(38 90% 65%)',
              borderColor: mode === 'light' ? 'hsl(38 90% 45%)' : 'hsl(38 90% 55%)',
            },
            '&.MuiChip-colorError.MuiChip-variantOutlined': {
              backgroundColor: 'transparent',
              color: mode === 'light' ? 'hsl(0 75% 35%)' : 'hsl(0 75% 65%)',
              borderColor: mode === 'light' ? 'hsl(0 75% 45%)' : 'hsl(0 75% 55%)',
            },
            '&.MuiChip-colorInfo.MuiChip-variantOutlined': {
              backgroundColor: 'transparent',
              color: mode === 'light' ? 'hsl(200 90% 30%)' : 'hsl(200 90% 60%)',
              borderColor: mode === 'light' ? 'hsl(200 90% 40%)' : 'hsl(200 90% 50%)',
            },
            '&.MuiChip-colorPrimary.MuiChip-variantOutlined': {
              backgroundColor: 'transparent',
              color: mode === 'light' ? 'hsl(263 70% 30%)' : 'hsl(263 70% 60%)',
              borderColor: mode === 'light' ? 'hsl(263 70% 40%)' : 'hsl(263 70% 50%)',
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
            '&.Mui-focusVisible': {
              outline: `3px solid ${colors.primary.main}`,
              outlineOffset: 3,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: colors.primary.main,
            textUnderlineOffset: '0.2em',
            textDecorationThickness: '0.1em',
            '&:hover': { textDecoration: 'underline' },
            '&:focus-visible': { textDecoration: 'underline' },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' 
              ? 'hsl(0 0% 100%)'  // Solid white
              : 'hsl(240 10% 3.9%)', // Solid dark
            backgroundImage: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: 12,
            border: `1px solid ${colors.divider}`,
          },
          root: {
            '& .MuiBackdrop-root': {
              backgroundColor: mode === 'light' 
                ? 'rgba(0, 0, 0, 0.5)' 
                : 'rgba(0, 0, 0, 0.7)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background.paper,
            backgroundImage: 'none',
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0, 0, 0, 0.08)' 
              : '0 2px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: 12,
            border: `1px solid ${colors.divider}`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: colors.background.paper,
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0, 0, 0, 0.08)' 
              : '0 2px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: 8,
            border: `1px solid ${colors.divider}`,
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
          ? "hsla(0, 0%, 100%, 0.85)" 
          : "hsla(240, 10%, 3.9%, 0.8)",
        border: mode === "light" 
          ? colors.divider 
          : "hsl(263 70% 50% / 0.2)",
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

// Backwards-compat export expected by some pages
export const blogTheme = theme;

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








