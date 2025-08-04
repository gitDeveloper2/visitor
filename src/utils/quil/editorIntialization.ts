// import { Quill } from "react-quill";
import { toolbarOptions } from "./quil";
import Quill from "quill";

export const initializeEditor = (
    containerRef: React.RefObject<HTMLDivElement>,
    quillRef: React.MutableRefObject<Quill | null>,
    initialContent: string,
    readOnly: boolean,
    toolbarHandlers: Record<string, () => void>
  ) => {
    if (containerRef.current && !quillRef.current) {
      const editorDiv = containerRef.current.appendChild(document.createElement("div"));
  
      quillRef.current = new Quill(editorDiv, {
        theme: "snow",
        readOnly,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: toolbarHandlers,
          },
        },
      });
  
      if (initialContent) {
        quillRef.current.clipboard.dangerouslyPasteHTML(initialContent);
      }
    }
  };
  