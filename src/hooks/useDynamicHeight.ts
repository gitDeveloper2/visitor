import { useEffect, useState } from "react";

const useEditorHeight = () => {
  const [editorHeight, setEditorHeight] = useState<string>("300px");

  useEffect(() => {
    const updateEditorHeight = () => {
      setEditorHeight(`${window.innerHeight * 0.85}px`);
    };

    updateEditorHeight();
    window.addEventListener("resize", updateEditorHeight);

    return () => {
      window.removeEventListener("resize", updateEditorHeight);
    };
  }, []);

  return editorHeight;
};

export default useEditorHeight;
