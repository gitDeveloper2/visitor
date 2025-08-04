import React from "react";
import { Element } from "html-react-parser";

const VOID_ELEMENTS = ["br", "img", "input", "hr", "meta", "link"];

export const renderChildren = (nodes: any[]): React.ReactNode[] => {
  return nodes.map((node, index) => {
    if (node.type === "text") return node.data;

    if (node.type === "tag" && VOID_ELEMENTS.includes(node.name)) {
      return React.createElement(node.name, { key: index, ...node.attribs });
    }

    if (node.type === "tag") {
      return React.createElement(
        node.name,
        { key: index, ...node.attribs },
        renderChildren(node.children)
      );
    }

    return null; // Ignore unsupported node types
  });
};
