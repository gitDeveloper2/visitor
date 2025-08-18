"use client";
import { useTheme } from "@mui/material/styles";

export default function BlogCssBaseline() {
  const theme = useTheme();
  
  return (
    <style jsx global>{`
      #learn-wrapper {
        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 600;
          line-height: 1.3;
          letter-spacing: -0.02em;
          margin: 2rem 0 1rem 0;
          color: ${theme.palette.text.primary};
        }

        h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
        }

        h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
        }

        h3 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        h4, h5, h6 {
          font-size: clamp(1.25rem, 2.5vw, 1.5rem);
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        p {
          font-size: 1.125rem;
          line-height: 1.7;
          margin: 1.5rem 0;
          color: ${theme.palette.text.secondary};
          font-weight: 400;
        }

        /* Lists */
        ul, ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        li {
          font-size: 1.125rem;
          line-height: 1.6;
          margin: 0.75rem 0;
          color: ${theme.palette.text.secondary};
        }

        ul li { list-style-type: disc; }
        ol li { list-style-type: decimal; }

        /* Hide legacy separate header to ensure single TOC card */
        #toc-header { display: none !important; }

        /* TOC - single container */
        #toc {
          background: ${theme.palette.background.paper};
          border: 1px dashed ${theme.palette.divider};
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin: 1rem 0 1.5rem 0;
        }

        #toc .toc-header {
          font-size: 1.1rem;
          font-weight: 600;
          color: ${theme.palette.primary.main};
          margin-bottom: 0.5rem;
          padding: 0.25rem 0;
        }

        #toc .toc-list {
          list-style: decimal inside;
          padding-left: 0.25rem;
          margin: 0;
        }

        #toc .toc-list li { margin: 0.4rem 0; font-size: 0.95rem; }
        #toc .toc-list a { color: ${theme.palette.primary.main}; text-decoration: none; font-weight: 500; }
        #toc .toc-list a:hover { color: ${theme.palette.primary.dark}; text-decoration: underline; }

        /* Code Blocks */
        code {
          background: ${theme.palette.mode === 'light' ? theme.palette.action.hover : theme.palette.action.selected};
          color: ${theme.palette.text.primary};
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
          border: 1px solid ${theme.palette.divider};
        }

        pre {
          background: ${theme.palette.mode === 'light' ? theme.palette.action.hover : theme.palette.action.selected};
          color: ${theme.palette.text.primary};
          padding: 1.5rem;
          border-radius: 12px;
          overflow-x: auto;
          margin: 2rem 0;
          border: 1px solid ${theme.palette.divider};
          box-shadow: ${theme.custom?.shadows?.elegant || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
        }

        pre code { background: transparent; padding: 0; border: none; color: inherit; }

        /* Blockquotes */
        blockquote {
          background: ${theme.palette.mode === 'light' ? theme.palette.action.hover : theme.palette.action.selected};
          border-left: 4px solid ${theme.palette.primary.main};
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: ${theme.palette.text.secondary};
        }

        /* Links */
        a { color: ${theme.palette.primary.main}; text-decoration: none; font-weight: 500; transition: all 0.2s ease; }
        a:hover { color: ${theme.palette.primary.dark}; text-decoration: underline; text-underline-offset: 0.2em; }

        /* Images */
        img { max-width: 100%; height: auto; border-radius: 12px; margin: 2rem 0; box-shadow: ${theme.custom?.shadows?.elegant || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}; }

        /* Tables */
        table { width: 100%; border-collapse: collapse; margin: 2rem 0; background: ${theme.palette.background.paper}; border-radius: 12px; overflow: hidden; box-shadow: ${theme.custom?.shadows?.elegant || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}; border: 1px solid ${theme.palette.divider}; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid ${theme.palette.divider}; }
        th { background: ${theme.palette.mode === 'light' ? theme.palette.action.hover : theme.palette.action.selected}; font-weight: 600; color: ${theme.palette.text.primary}; }

        /* Responsive improvements */
        @media (max-width: 768px) {
          h1, h2, h3, h4, h5, h6 { margin: 1.5rem 0 0.75rem 0; }
          p, li { font-size: 1rem; line-height: 1.6; }
          pre { padding: 1rem; font-size: 0.875rem; }
          blockquote { padding: 1rem 1.25rem; margin: 1.25rem 0; }
        }

        /* Glass sections */
        .glass-section { background: ${theme.palette.mode === 'light' ? 'hsla(0, 0%, 100%, 0.85)' : 'hsla(240, 10%, 3.9%, 0.85)'}; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid ${theme.palette.divider}; border-radius: 16px; padding: 2rem; margin: 2rem 0; }

        /* Focus */
        a:focus, button:focus, input:focus, textarea:focus, select:focus { outline: 2px solid ${theme.palette.primary.main}; outline-offset: 2px; }

        /* Selection */
        ::selection { background: ${theme.palette.primary.main}40; color: ${theme.palette.text.primary}; }

        /* Scrollbar */
        .content-scroll { scrollbar-width: thin; scrollbar-color: ${theme.palette.divider} transparent; }
        .content-scroll::-webkit-scrollbar { width: 6px; }
        .content-scroll::-webkit-scrollbar-track { background: transparent; }
        .content-scroll::-webkit-scrollbar-thumb { background: ${theme.palette.divider}; border-radius: 3px; }
        .content-scroll::-webkit-scrollbar-thumb:hover { background: ${theme.palette.text.secondary}; }
      }
    `}</style>
  );
}
