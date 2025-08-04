import React from "react";
import { DOMNode, Element } from "html-react-parser";
import MuiTable from "@components/blog/Table";

const extractNestedText = (node: any, depth = 0, maxDepth = 10): string => {
  if (!node || depth > maxDepth) return "No Data";

  if (node.type === "text") return node.data.trim();

  if (node.children && Array.isArray(node.children)) {
    return node.children
      .map((child) => extractNestedText(child, depth + 1, maxDepth))
      .join(" ")
      .trim();
  }

  return "No Data";
};

export const processTableNode = (domNode: DOMNode) => {
  if (
    domNode instanceof Element &&
    domNode.name === "div" &&
    domNode.attribs &&
    domNode.attribs["class"] === "quill-better-table-wrapper"
  ) {
    const children = domNode.children as DOMNode[];
    const tableElement = children.find(
      (child) => child instanceof Element && child.name === "table"
    );

    if (tableElement && tableElement instanceof Element) {
      const rows = (tableElement.children as any[]).filter(
        (child) => child instanceof Element && child.name === "tr"
      );

      // Handle nested tbody tags
      if (!rows.length) {
        const tbody = (tableElement.children as any[]).find(
          (child) => child instanceof Element && child.name === "tbody"
        );
        if (tbody) {
          rows.push(
            ...(tbody.children as any[]).filter(
              (child) => child instanceof Element && child.name === "tr"
            )
          );
        }
      }

      if (!rows.length) {
        console.warn("No rows found in the table.");
        return <MuiTable rows={[]} />;
      }

      const processedRows = rows.map((row: any) => {
        const processedCells = Array.isArray(row.children)
          ? row.children
              .filter((cell: any) => cell instanceof Element && cell.name === "td")
              .map((cell: any) => {
                const cellData = extractNestedText(cell);
                return { data: cellData || "No Data" };
              })
          : [];

        return { children: processedCells };
      });

      if (process.env.NODE_ENV === "development") {
        console.debug("Processed Rows:", processedRows);
      }

      return <MuiTable rows={processedRows} />;
    }
  }

  return null;
};
