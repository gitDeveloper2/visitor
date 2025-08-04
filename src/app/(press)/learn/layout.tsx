// app/learn/layout.tsx
import { ThemeProvider } from '@mui/material/styles';
import BlogCss from './BlogCssBaseline';
import { blogTheme } from '../../theme';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
  
      <ThemeProvider theme={{}}>
        <BlogCss />
        {children}
      </ThemeProvider>
  
  );
}

