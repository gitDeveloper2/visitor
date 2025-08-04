import React from "react";
import { Element } from "html-react-parser";
import { renderChildren } from "./recursiveRender";
import ImageWithCaption from "@components/customhtml/ImageWithCaption";
import { CodeBox } from "@styles/globalStyles";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Typography,
} from "@mui/material"; // Import MUI's Link component
import { Error, Info, InfoOutlined, Warning } from "@mui/icons-material";
import { Dates, Metadata } from "@components/blog/BloogComponentContainer";
import { date } from "zod";
import HrAd from "@components/adds/google/GoogleAd";
import GoogleAd from "@components/adds/google/GoogleAd";
import PostMeta from "@components/blog/PostMetaData";

// import { ResponsiveNativeBannerAd } from "@components/adds/ResponsiveNativeBannerAd";

// Process all relevant tags
export const replaceCodeTags = (domNode: Element) => {
  // console.log("evaluating pre ",domNode)
  if (domNode instanceof Element) {
    // Remove unnecessary inline styles
    if (domNode.attribs) {
      delete domNode.attribs.style;
    }
  }

  // Handle Quill-specific code blocks inside <pre> tags
  if (
    domNode.name === "pre" &&
    domNode.attribs &&
    domNode.attribs["data-language"]
  ) {
    return replaceQuillPreTags(domNode);
  }

  // Handle Quill-specific code blocks in <div> format
  if (
    domNode.name === "div" &&
    domNode.attribs.class === "ql-code-block-container"
  ) {
    return replaceQuillCodeTags(domNode);
  }

  // Handle standard <code> tags
  if (domNode.name === "code") {
    return replaceStandardCodeTags(domNode);
  }

  return null; // If the tag is neither Quill-specific nor a standard code block
};

// Handle Quill's new <pre> tags with `data-language` attributes
export const replaceQuillPreTags = (domNode: Element) => {
  const language = domNode.attribs["data-language"] || "plain"; // Default to "plain"
  const codeContent = domNode.children
    .filter((child) => child.type === "text")
    .map((child) => (child as any).data || "")
    .join("");

  return (
    <CodeBox language={language} theme="light">
      {codeContent}
    </CodeBox>
  );
};

// Handle Quill-specific <div> code blocks
export const replaceQuillCodeTags = (domNode: Element) => {
  const codeLines = domNode.children
    .filter(
      (child) =>
        (child as Element).name === "div" &&
        (child as Element).attribs.class === "ql-code-block"
    )
    .map((child) => {
      const textNodes = (child as Element).children.filter(
        (grandChild) => grandChild.type === "text"
      );
      return textNodes.map((textNode) => (textNode as any).data || "").join("");
    });

  const codeContent = codeLines.join("\n");

  return (
    <CodeBox language="javascript" theme="light">
      {codeContent}
    </CodeBox>
  );
};

// Handle standard <code> tags
export const replaceStandardCodeTags = (domNode: Element) => {
  const codeContent = domNode.children
    .filter((child) => child.type === "text")
    .map((child) => (child as any).data || "")
    .join("");

  return (
    <CodeBox language="javascript" theme="light">
      {codeContent}
    </CodeBox>
  );
};

// Process <img> tags
export const replaceImgTags = (domNode: Element) => {
  if (!domNode.attribs) return null; // Null check

  const src = domNode.attribs.src ?? "";
  const alt = domNode.attribs.alt || "";
  const caption = domNode.attribs.caption || "";
  const attributionText = domNode.attribs.attributiontext;
  const attributionLink = domNode.attribs.attributionlink;
  const legacyAttribution = domNode.attribs.attribution;

  const attribution =
    attributionText && attributionLink
      ? { url: attributionLink, text: attributionText }
      : legacyAttribution
      ? { url: legacyAttribution, text: legacyAttribution }
      : undefined;
  // console.log(attribution)

  return (
    <ImageWithCaption
      src={src}
      alt={alt}
      caption={caption}
      attribution={attribution}
    />
  );
};


export const replaceReferenceSpan = (domNode: Element) => {
  if (domNode.attribs && domNode.attribs["data-ref-id"]) {
    const {
      "data-url": url,
      "data-author-firstname": firstName,
      "data-author-lastname": lastName,
      "data-title": title,
      "data-publisher": publisher,
      "data-date": dateRaw,
      "data-type": type,
    } = domNode.attribs;

    // Author: "Last, F."
    const authorInitial = firstName ? `${firstName[0]}.` : "";
    const author = lastName ? `${lastName}, ${authorInitial}`.trim() : "";

    // Date: (YYYY, Month DD).
    let date = "";
    if (dateRaw) {
      const parsed = new Date(dateRaw);
      const year = parsed.getFullYear();
      const month = parsed.toLocaleString("en-US", { month: "long" });
      const day = parsed.getDate();
      date = `(${year}, ${month} ${day}).`;
    }

    // Sentence case: only first letter capitalized
    const sentenceCase = (str: string | undefined) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    // Compose citation parts
    const formattedTitle = sentenceCase(title);
    const citationStart = `${author} ${date}`;

    let citation: JSX.Element;
    const cleanUrl = url?.endsWith("/") ? url.slice(0, -1) : url;

    // Avoid adding period after URL
    let citationContent = (
      <>
        {citationStart} <i>{formattedTitle}</i>. {publisher}
        {cleanUrl && !cleanUrl.endsWith('.') && ` ${cleanUrl}`}
      </>
    );

    switch (type) {
      case "book":
        citation = (
          <>
            {citationStart} <i>{formattedTitle}</i>. {publisher}.
          </>
        );
        break;

      case "article":
        citation = (
          <>
            {citationStart} {formattedTitle}.
          </>
        );
        break;

      case "website":
        citation = (
          <>
            {citationStart} <i>{formattedTitle}</i>. {publisher}.
            {cleanUrl && !cleanUrl.endsWith('.') && ` ${cleanUrl}`}
          </>
        );
        break;

      default:
        citation = (
          <>
            {citationStart} {formattedTitle}.
          </>
        );
        break;
    }

    return cleanUrl ? (
      <Link
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        color="primary"
      >
        {citation}
      </Link>
    ) : (
      <Typography component="span">{citation}</Typography>
    );
  }

  return domNode;
};





// Replace context card with MUI Card and style it based on data-type
export const replaceContextCard = (domNode: Element) => {
  if (
    domNode.attribs &&
    domNode.attribs["data-title"] &&
    domNode.attribs["data-content"]
  ) {
    const title = domNode.attribs["data-title"];
    const content = domNode.attribs["data-content"];
    const type = domNode.attribs["data-type"]; // info, warning, or danger

    // Determine the styles and icon based on the type
    let cardStyle = {};
    let icon;
    let backgroundColor = "";
    let borderColor = "";

    switch (type) {
      case "info":
        backgroundColor = "#e3f2fd"; // Light blue for info
        borderColor = "#2196f3"; // Blue border
        icon = <InfoOutlined />;
        break;
      case "warning":
        backgroundColor = "#fff3e0"; // Light orange for warning
        borderColor = "#ff9800"; // Orange border
        icon = <Warning />;
        break;
      case "danger":
        backgroundColor = "#ffebee"; // Light red for danger
        borderColor = "#f44336"; // Red border
        icon = <Error />;
        break;
      default:
        backgroundColor = "#ffffff"; // Default white if type is unknown
        borderColor = "#000000"; // Default black border
        icon = <Info />;
    }

    // Apply dynamic styles based on the card type
    cardStyle = {
      backgroundColor,
      borderLeft: `5px solid ${borderColor}`, // A border to the left for distinction
      marginBottom: 2,
    };

    return (
      <Card
        sx={{
          ...cardStyle,
          width: "100%", // Ensures the card spans the full width of its container
          backgroundColor: "background.paper",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
          },
          overflow: "hidden",
        }}
      >
        <CardHeader
          avatar={
            <IconButton
              sx={{
                backgroundColor: borderColor,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              {icon}
            </IconButton>
          }
          titleTypographyProps={{
            variant: "h6",
            fontWeight: "bold",
            color: "text.primary",
            component: "p",
          }}
          title={title}
        />
        <CardContent>
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.6, color: "text.secondary" }}
          >
            {content}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  // If no valid attributes, return the node as is
  return domNode;
};

export const addH1Ads = (
  domNode: Element,
  h2Count: number,
  metadata: Metadata,
  author: string,
  url: string
) => {
  if (domNode.tagName === "h1") {
    // Return the modified h1 with an additional paragraph
    return (
      <>
        <header>
          <h1>{renderChildren(domNode.children)}</h1>
          {/* <p>Created: {dates.created}</p>
        <p>Published: {dates.modified}</p> */}
         <PostMeta
  author={author}
  createdAt={metadata.dates.created}
  shareUrl={url}
  tags={typeof metadata.tags === "string" ? metadata.tags.split(",").map(tag => tag.trim()).filter(Boolean) : []}
  updatedAt={metadata.dates.modified}
/>

          <GoogleAd slot="5966304209" />
        </header>
      </>
    );
  }
};

export const addAds = (domNode: Element | any, h2Count: number) => {
  if (domNode instanceof Element && domNode.name === "h2") {
    // Function to recursively render children, handling void elements
    const renderChildren = (nodes: any[]) => {
      return nodes.map((node, index) => {
        // Render text content directly
        if (node.type === "text") {
          return node.data;
        }

        // Handle void elements (e.g., br, img, input)
        const voidElements = ["br", "img", "input", "hr", "meta", "link"];
        if (node.type === "tag" && voidElements.includes(node.name)) {
          return React.createElement(node.name, { key: index });
        }

        // Render non-void element nodes recursively
        if (node.type === "tag") {
          return React.createElement(
            node.name,
            { key: index }, // No attributes passed to children
            renderChildren(node.children) // Recursively render nested children
          );
        }

        return null; // Ignore other node types (e.g., comments)
      });
    };

    // Extract attributes for the <h2> element only
    const h2Attributes = { ...domNode.attribs };
    delete h2Attributes.style; // Optionally remove specific attributes like `style`

    // Render the <h2> element with attributes
    const h2Content = (
      <h2 {...h2Attributes}>{renderChildren(domNode.children)}</h2>
    );

    // Insert advertisement after every third <h2>
    if (h2Count === 2) {
      return (
        <>
          {h2Content}
          <p>loading h2 add</p>
          {/* <ResponsiveNativeBannerAd /> */}
        </>
      );
    }

    // Return the <h2> tag as is if no ad is to be inserted
    return h2Content;
  }

  return domNode;
};
