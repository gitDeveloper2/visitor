# Material-UI Theme Guide

This guide explains how to use the Material-UI theme system consistently across the BasicUtils project.

## 🌙 Light & Dark Theme Support

The project now supports both light and dark themes with automatic switching based on:
- User preference (stored in localStorage)
- System preference (prefers-color-scheme)
- Manual toggle via the theme switcher

### Theme Toggle Component

The `ThemeToggle` component is automatically included in the Header and allows users to switch between themes:

```tsx
import ThemeToggle from "@/components/ThemeToggle";

// The toggle is already included in the Header component
// Users can click the sun/moon icon to switch themes
```

### Theme Context

Use the theme context to access theme state and functions:

```tsx
import { useTheme } from "@/contexts/ThemeContext";

const MyComponent = () => {
  const { mode, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {mode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
};
```

## 🎨 Core Theme Properties

### Color Palette

The theme provides consistent colors for both light and dark modes:

```tsx
const theme = useTheme();

// Primary colors (same in both modes)
theme.palette.primary.main    // hsl(263 70% 50%)
theme.palette.primary.light   // hsl(263 70% 60%)
theme.palette.primary.dark    // hsl(263 70% 40%)

// Background colors (adapts to mode)
theme.palette.background.default  // Light: white, Dark: dark gray
theme.palette.background.paper    // Light: white with opacity, Dark: dark with opacity

// Text colors (adapts to mode)
theme.palette.text.primary    // Light: dark text, Dark: light text
theme.palette.text.secondary  // Light: gray text, Dark: light gray text
```

### Custom Theme Extensions

The theme includes custom properties for consistent design tokens:

```tsx
// Gradients (same in both modes)
theme.custom.gradients.primary  // Linear gradient for primary actions
theme.custom.gradients.secondary // Linear gradient for secondary actions
theme.custom.gradients.hero     // Hero section gradient

// Glass morphism effects (adapts to mode)
theme.custom.glass.background   // Glass background color
theme.custom.glass.border       // Glass border color

// Shadows (adapts to mode)
theme.custom.shadows.elegant    // Subtle shadow for cards
theme.custom.shadows.neon       // Glowing shadow for effects

// Animations (same in both modes)
theme.custom.animations.float   // Floating animation
theme.custom.animations.glow    // Glowing animation
```

## 🛠️ Helper Functions

### Theme Utilities

Import helper functions from `@/utils/themeUtils`:

```tsx
import { 
  getGradient, 
  getGlassStyles, 
  getShadow, 
  getAnimation,
  commonStyles,
  typographyVariants 
} from "@/utils/themeUtils";

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        ...getGlassStyles(theme),           // Glass morphism effect
        boxShadow: getShadow(theme, 'elegant'), // Elegant shadow
        animation: getAnimation(theme, 'float'), // Floating animation
      }}
    >
      <Button sx={commonStyles.gradientButton(theme)}>
        Gradient Button
      </Button>
    </Box>
  );
};
```

### Common Style Patterns

Use predefined style patterns for consistency:

```tsx
// Glass card with shadow
sx={commonStyles.glassCard(theme)}

// Gradient button
sx={commonStyles.gradientButton(theme)}

// Glass button
sx={commonStyles.glassButton(theme)}

// Text gradient
sx={commonStyles.textGradient(theme)}

// Floating element
sx={commonStyles.floatingElement(theme)}

// Glowing element
sx={commonStyles.glowingElement(theme)}
```

### Typography Variants

Use consistent typography patterns:

```tsx
// Hero title
sx={typographyVariants.heroTitle}

// Section title
sx={typographyVariants.sectionTitle}

// Card title
sx={typographyVariants.cardTitle}

// Large body text
sx={typographyVariants.bodyLarge}

// Caption text
sx={typographyVariants.caption}
```

## 📱 Responsive Design

### Breakpoints

Use Material-UI's responsive breakpoints:

```tsx
sx={{
  fontSize: { xs: '1rem', md: '1.5rem' },
  padding: { xs: 2, sm: 3, md: 4 },
  display: { xs: 'block', md: 'flex' },
}}
```

### Layout Helpers

Use predefined layout patterns:

```tsx
// Full height container
sx={layoutHelpers.fullHeight}

// Centered content
sx={layoutHelpers.centered}

// Responsive grid
sx={layoutHelpers.responsiveGrid}

// Responsive text alignment
sx={layoutHelpers.responsiveText}
```

## 🎭 Animation Helpers

### Framer Motion Integration

Use predefined animation patterns:

```tsx
import { motion } from "framer-motion";

const MyComponent = () => {
  return (
    <motion.div
      {...animationHelpers.fadeIn}
      whileHover={{ scale: 1.05 }}
    >
      Content
    </motion.div>
  );
};
```

## 🎯 Best Practices

### 1. Always Use Theme Values

❌ Don't use hardcoded colors:
```tsx
sx={{ color: '#1976d2' }}
```

✅ Use theme values:
```tsx
sx={{ color: theme.palette.primary.main }}
```

### 2. Use Helper Functions

❌ Don't repeat glass styles:
```tsx
sx={{
  background: theme.custom.glass.background,
  border: `1px solid ${theme.custom.glass.border}`,
  backdropFilter: 'blur(16px)',
}}
```

✅ Use helper functions:
```tsx
sx={getGlassStyles(theme)}
```

### 3. Consistent Spacing

❌ Don't use arbitrary values:
```tsx
sx={{ padding: 16 }}
```

✅ Use theme spacing:
```tsx
sx={{ p: 2 }} // 16px in theme spacing
```

### 4. Responsive Design

❌ Don't ignore mobile:
```tsx
sx={{ fontSize: '2rem' }}
```

✅ Use responsive values:
```tsx
sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
```

## 🔧 Component Examples

### Card Component

```tsx
import { Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles } from "@/utils/themeUtils";

const MyCard = () => {
  const theme = useTheme();
  
  return (
    <Card sx={commonStyles.glassCard(theme)}>
      <CardContent>
        <Typography variant="h6" sx={typographyVariants.cardTitle}>
          Card Title
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          Card content
        </Typography>
      </CardContent>
    </Card>
  );
};
```

### Button Component

```tsx
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { commonStyles } from "@/utils/themeUtils";

const MyButton = () => {
  const theme = useTheme();
  
  return (
    <Button sx={commonStyles.gradientButton(theme)}>
      Click Me
    </Button>
  );
};
```

### Section Component

```tsx
import { Box, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { commonStyles, typographyVariants } from "@/utils/themeUtils";

const MySection = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ ...commonStyles.sectionSpacing }}>
      <Container maxWidth={commonStyles.containerMaxWidth}>
        <Typography 
          variant="h2" 
          sx={{ 
            ...typographyVariants.sectionTitle,
            ...commonStyles.textGradient(theme)
          }}
        >
          Section Title
        </Typography>
      </Container>
    </Box>
  );
};
```

## 🚀 Adding New Components

When creating new components:

1. **Import theme utilities**:
   ```tsx
   import { useTheme } from "@mui/material/styles";
   import { commonStyles, getGlassStyles } from "@/utils/themeUtils";
   ```

2. **Use theme hook**:
   ```tsx
   const theme = useTheme();
   ```

3. **Apply consistent styling**:
   ```tsx
   sx={{
     ...getGlassStyles(theme),
     ...commonStyles.sectionSpacing,
   }}
   ```

4. **Use responsive design**:
   ```tsx
   sx={{
     fontSize: { xs: '1rem', md: '1.5rem' },
     textAlign: { xs: 'center', md: 'left' },
   }}
   ```

## 🔍 Troubleshooting

### Theme Not Updating

If theme changes aren't reflected:

1. Ensure you're using `useTheme()` from `@/contexts/ThemeContext`
2. Check that the component is wrapped in `ThemeProvider`
3. Verify localStorage isn't blocking the theme change

### Colors Not Consistent

If colors look wrong:

1. Use `theme.palette` values instead of hardcoded colors
2. Check that you're using the correct theme mode (light/dark)
3. Verify helper functions are being used correctly

### Glass Effects Not Working

If glass morphism isn't working:

1. Use `getGlassStyles(theme)` helper function
2. Ensure backdrop-filter is supported by the browser
3. Check that the background has proper opacity

## 📚 Additional Resources

- [Material-UI Theme Documentation](https://mui.com/material-ui/customization/theme/)
- [Material-UI System Documentation](https://mui.com/system/getting-started/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

This theme system ensures consistent, beautiful, and accessible design across the entire BasicUtils application while supporting both light and dark modes seamlessly. 