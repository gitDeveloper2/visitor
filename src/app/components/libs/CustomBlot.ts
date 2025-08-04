import { EmbedBlot } from "parchment";
import Quill from "quill";

if (typeof window !== "undefined") {
  const BlockEmbed = Quill.import("blots/block/embed") as typeof EmbedBlot;

  interface ImageBlotValue {
    url: string;
    alt?: string;
    caption?: string;
    attribution?: string;
  }

  class ImageBlot extends BlockEmbed {
    static blotName = "imageBlot";
    static tagName = "img";
    static className = "custom-image-blot";

    static create(value: ImageBlotValue) {
      const node = super.create() as HTMLElement;
      node.setAttribute("src", value.url);
      node.setAttribute("alt", value.alt || "Custom Image");
      node.setAttribute("caption", value.caption || "");
      node.setAttribute("attribution", value.attribution || "");
      return node;
    }

    static value(node: HTMLElement): ImageBlotValue {
      return {
        url: node.getAttribute("src") || "",
        alt: node.getAttribute("alt") || "",
        caption: node.getAttribute("caption") || "",
        attribution: node.getAttribute("attribution") || "",
      };
    }
  }

  Quill.register("formats/imageBlot", ImageBlot);

}