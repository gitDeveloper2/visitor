// "use client";
// import React from "react";
// import { StyledSectionGrid } from "./Spacing";
// import { Grid, useTheme } from "@mui/material";
// import BlogComponent from "./BlogContent";
// import getRelatedPages from "../data/RelatedPages";
// import ReactDOMServer from "react-dom/server";
// import Compressor from "../data/blogs/Compressor";
// import { CodeBox } from "@styles/globalStyles";
// import parse, { Element } from 'html-react-parser';
// // import { Element } from 'html-react-parser/lib/parse';
// export interface RelatedPage {
//   url: string;
//   title: string;
// }
// export interface RelatedPagesDocument {
//   page: string;
//   relatedPages: RelatedPage[];
// }

// interface BloogComponentContainerProps {
//   parentPath: string;
//   relatedPages:string;
//   thisPagePath: string;
//   content: string;
// }
// // Function to replace <code> tags with <CodeBox>
// const replaceCodeTags = (html: string) => {
//   return parse(html, {
//     replace: (domNode) => {
//       if (domNode && (domNode as Element).name === 'code') {
//         const element = domNode as Element;
//         // Combine all children data into a single string
//         const codeContent = element.children
//           .map(child => (child as any).data || '') // Handle each child and concatenate data
//           .join('\n'); // Join with newline if code is spread across multiple lines

//         return (
//           <CodeBox language="javascript" theme="light">
//             {codeContent}
//           </CodeBox>
//         );
//       }
//     },
//   });
// };
// const BlogComponentContainer: React.FC<BloogComponentContainerProps> = ({
//   parentPath,
//   relatedPages,
//   thisPagePath,
//   content,
// }) => {
//   const theme = useTheme();
//   const newcontent=replaceCodeTags(content)
//   console.log("related pages")
//   console.log(relatedPages)

//   console.log("related pages")

//   return (
    
//     <StyledSectionGrid theme={theme} container gap={1} y16>
//       <Grid item xs={12}>
//         <BlogComponent
//           // relatedPages={getRelatedPages(parentPath, thisPagePath)}
//           relatedPages={relatedPages}
//           blogComponent={<div>{replaceCodeTags(content)}</div>}
          


//         />
      
//       </Grid>
//     </StyledSectionGrid>
//   );
// };

// export default BlogComponentContainer;
