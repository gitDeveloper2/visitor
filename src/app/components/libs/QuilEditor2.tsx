"use client";

import React, { useRef, useState } from "react";
import Quill from "quill";
import dynamic from "next/dynamic";
import { BibliographyState } from "../../../hooks/useBibliography";
import { FAQ } from "./faqReducer";

const Editor = dynamic(() => import("./Editor"), { ssr: false });


interface EditorPageProps{
  initialContent:string;
   slug:string;
   refs:BibliographyState;
   faqs:FAQ[]
   content:"blog"|"news";
}
const EditorPage = ({ initialContent,slug,refs,faqs,content }:EditorPageProps) => {
  const [readOnly, setReadOnly] = useState(false);
  const quillRef = useRef<Quill | null>(null);
  

  return (
    <div style={{ padding: "20px" }}>
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        initialContent={initialContent}
        slug={slug}
        refs={refs}
        faqs={faqs}
        content={content}
      />
      {/* <div className="controls">
        <label>
          Read Only:{" "}
          <input
            type="checkbox"
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
      </div> */}
    </div>
  );
};

export default EditorPage;
