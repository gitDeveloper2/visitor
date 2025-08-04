
export const HtmlEditor = ({
    editorHeight,
    containerRef,
  }: {
    editorHeight: string;
    containerRef: React.RefObject<HTMLDivElement>;
  }) => (
          
        <div ref={containerRef} style={{ height: editorHeight }} />
   
  );