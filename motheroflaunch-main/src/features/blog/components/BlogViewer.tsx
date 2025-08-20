'use client';

import { Box } from '@mui/material';

type BlogViewerProps = {
  htmlContent: string;
};

export default function BlogViewer({ htmlContent }: BlogViewerProps) {
  return (
    <article
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}  

// export default function BlogViewer({ htmlContent }: BlogViewerProps) {
//   return (
//     <Box
//       className="blog-content"
//       sx={{
//         typography: 'body1',
//         lineHeight: 1.75,
//         '& h1': { fontSize: '2rem', fontWeight: 600, mt: 4, mb: 2 },
//         '& h2': { fontSize: '1.5rem', fontWeight: 500, mt: 3, mb: 1.5 },
//         '& h3': { fontSize: '1.25rem', fontWeight: 500, mt: 2.5, mb: 1 },
//         '& p': { mb: 2 },
//         '& ul': { pl: 3, mb: 2 },
//         '& ol': { pl: 3, mb: 2 },
//         '& li': { mb: 1 },
//         '& a': {
//           color: 'primary.main',
//           textDecoration: 'underline',
//           '&:hover': { textDecoration: 'none' },
//         },
//         '& img': {
//           maxWidth: '100%',
//           borderRadius: 2,
//           my: 2,
//         },
//         '& blockquote': {
//           pl: 2,
//           borderLeft: '4px solid',
//           borderColor: 'grey.300',
//           color: 'grey.700',
//           fontStyle: 'italic',
//           my: 3,
//         },
//         '& pre': {
//           backgroundColor: 'grey.100',
//           p: 2,
//           borderRadius: 2,
//           overflow: 'auto',
//           fontSize: '0.875rem',
//           my: 2,
//         },
//         '& code': {
//           fontFamily: 'monospace',
//           backgroundColor: 'grey.100',
//           px: 0.5,
//           borderRadius: 1,
//         },
//       }}
//       dangerouslySetInnerHTML={{ __html: htmlContent }}
//     />
//   );
// }
