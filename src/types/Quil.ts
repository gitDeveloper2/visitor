import Quill from "quill";
import { BibliographyState } from "../hooks/useBibliography";

export interface UseQuillEditorProps {
    containerRef: React.RefObject<HTMLDivElement>;
    initialContent?: string;
    readOnly?: boolean;
    onTextChange?: (semanticHTML: string) => void;
    onSelectionChange?: (...args: any[]) => void;
    ref: React.ForwardedRef<Quill | null>;
    setHtmlContent: (html:string)=>void;
    htmlContent:string,  // Pass htmlContent here
    slug:string,         // Pass slug here
    isHtmlMode:boolean,
    setIsHtmlMode: React.Dispatch<React.SetStateAction<boolean>>;
    wordCount:number;
    refs:BibliographyState;
    content:"blog"|"news";
  
    // generateToc:boolean,  // Pass generateToc here
  }