import Quill from "quill";
import { EmbedBlot } from "parchment";
const BlockEmbed = Quill.import("blots/block/embed") as typeof EmbedBlot;

      export class ImageBlot extends BlockEmbed {
        static blotName = "imageBlot";
        static tagName = "img";

        static create(value: any) {
          const node = super.create() as HTMLElement;
          node.setAttribute("src", value.url);
          node.setAttribute("alt", value.alt || "Custom Image");
          node.setAttribute("caption", value.caption || "");
          node.setAttribute("attributionText", value.attributionText || "");
          node.setAttribute("attributionLink", value.attributionLink || "");
          return node;
        }

        static value(node: HTMLElement) {
          return {
            url: node.getAttribute("src") || "",
            alt: node.getAttribute("alt") || "",
            caption: node.getAttribute("caption") || "",
            attributionText: node.getAttribute("attributionText") || "",
            attributionLink: node.getAttribute("attributionLink") || "",
          };
        }
      }