// app/news/layout.tsx
import { ThemeProvider } from '../../../context/ThemeContext';
import BlogCss from './BlogCssBaseline';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
  
      <ThemeProvider>
        <BlogCss />
        {children}
      </ThemeProvider>
  
  );
}

