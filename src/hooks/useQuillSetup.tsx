import { useCallback, useEffect, useRef, useState } from "react";
import Quill, { Delta } from "quill";
import { cleanQuilHTML } from "../utils/transformers/HtmlStrings";
import { registerQuillIcons, toolbarOptions } from "../utils/quil/quil";
import { createToolbarHandlers } from "../utils/quil/toolbarHandlers";
import { UseQuillEditorProps } from "../types/Quil";
import ImageDialog from "@components/libs/CustomImageDialog";
import { useReferenceHandlers } from "./useReferenceHandlers";
import { ReferenceBlot } from "@components/blots/ReferenceBlot";
import { FAQ } from "@components/libs/faqReducer";
import BetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
import { table } from "node:console";
const useQuillEditor = ({
  refs,
  containerRef,
  initialContent,
  readOnly,
  onTextChange,
  onSelectionChange,
  ref,
  setHtmlContent,
  htmlContent,
  slug,
  isHtmlMode,
  setIsHtmlMode,
  wordCount,
  content
}: UseQuillEditorProps) => {
  const quillRef = useRef<Quill | null>(null);
  const htmlContentRef = useRef(htmlContent); // Add a ref to store the current value of htmlContent
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCardData, setSelectedCardData] = useState<{
    title: string;
    content: string;
    type: string;
  } | null>(null);
  const selectionRange = useRef<{ index: number; length: number } | null>(null);
  const [isContentSaving, setIsContentSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);
  // const [faqState,setFaqState]= useState<FAQ[]>([])
  const faqState = useRef([]);
  // const [generateToc, setGenerateToc] = useState<boolean>(false); // Now managed in the hook
  const generateTocRef = useRef(false);
  const {
    referenceToEdit,
    isModalOpen,
    state,
    stateRef,
    openModal,
    closeModal,
    handleInsertReference,
    handleUpdateReference,
    handleReferenceClick,
    handleDeleteReference,
    editReference,
  } = useReferenceHandlers(quillRef.current, refs);

  useEffect(() => {
    htmlContentRef.current = htmlContent; // Update ref whenever htmlContent changes

    const handleSave = async () => {
      const api=content==="blog"?"content":"content-news";
      setIsContentSaving(true);
      try {
        const response = await fetch(`/api/${api}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: htmlContentRef.current, // Use ref value instead of prop value
            slug,
            generateToc: generateTocRef.current, // Add the checkbox state to the API call
            refs: stateRef.current,
            faqs: faqState.current,
          }),
        });

        if (response.ok) {
          if (quillRef.current) {
            quillRef.current.clipboard.dangerouslyPasteHTML(
              htmlContentRef.current
            ); // Use ref value instead of prop value
          }
          window.location.reload();
        } else {
          setErrorMsg("Failed to save content.");
        }
      } catch (error) {
        // console.log(error);
        setErrorMsg(`Error: ${error}`);
      } finally {
        setIsContentSaving(false);
      }
    };

    const toolbarHandlers = createToolbarHandlers(
      quillRef,
      setHtmlContent,
      setIsHtmlMode,
      handleSave,
      setOpenDialog,
      setOpenImageDialog,
      setSelectedCardData,
      // setGenerateToc,
      // getSelectionRange,
      setSelectionRange,
      generateTocRef
    );

    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    if (containerRef.current && !quillRef.current) {
      registerQuillIcons();
      Quill.register({
        "modules/better-table": BetterTable,
      }, true);
   

      const editorDiv = containerRef.current.appendChild(
        document.createElement("div")
      );
      quillRef.current = new Quill(editorDiv, {
        theme: "snow",
        readOnly,
        modules: {
          table:false,
          'better-table': {
        operationMenu: {
          items: {
            unmergeCells: {
              text: 'Another unmerge cells name'
            }
          },
          color: {
            colors: ['green', 'red', 'yellow', 'blue', 'white'],
            text: 'Background Colors:'
          }
        }
      },
          toolbar: {
            container: toolbarOptions, // Use predefined toolbar options
            handlers: {
              ...toolbarHandlers.handlers,
              reference: () => openModal(),
            },
          },
          
          keyboard: {
            bindings: BetterTable.keyboardBindings,
          },
        
        },
      });

      quillRef.current.keyboard.addBinding(
        { key: "Backspace" }, // Bind to the backspace key
        (range, context) => {
          if (range.index === 0) {
            // Prevent deletion at the start of the editor
            return true;
          }

          const [blot, offset] = quillRef.current.scroll.descendant(
            ReferenceBlot,
            range.index - 1
          );

          if (blot && offset === blot.length() - 1) {
            // Cursor is at the end of the custom blot
            blot.deleteAt(offset, 1); // Call the blot's deleteAt method
            const id = blot.formats().reference.id;

            handleDeleteReference(id);
            return false; // Prevent default backspace behavior
          }

          return true; // Allow default behavior for other content
        }
      );

      const processReferenceElement = (element: HTMLElement) => ({
        id: element.getAttribute("data-ref-id"),
        type: element.getAttribute("data-type"),
        authorFirstName: element.getAttribute("data-author-firstname"),
        authorLastName: element.getAttribute("data-author-lastname"),
        title: element.getAttribute("data-title"),
        publisher: element.getAttribute("data-publisher"),
        date: element.getAttribute("data-date"),
        url: element.getAttribute("data-url") || undefined,
        linkText: element.getAttribute("data-linktext") || undefined,
        journalName: element.getAttribute("data-journal-name") || undefined,
        volume: element.getAttribute("data-volume") || undefined,
        issue: element.getAttribute("data-issue") || undefined,
        pageRange: element.getAttribute("data-page-range") || undefined,
        doi: element.getAttribute("data-doi") || undefined,
        websiteName: element.getAttribute("data-website-name") || undefined,
        kind: element.getAttribute("data-kind") || undefined,
      });

      const updateDeltaWithReference = (
        delta: any,
        referenceAttributes: Record<string, string>,
        text: string
      ) => {
        const newOps: any[] = [];
        delta.ops.forEach((op: any) => {
          if (op.insert && typeof op.insert === "string") {
            // Add the reference attribute to the first operation
            newOps.push({
              insert: text, // Replace the text with a static value or keep as needed
              attributes: {
                reference: referenceAttributes,
              },
            });

            // Add a retain operation (if needed)
            // newOps.push({ retain: JSON.stringify(referenceAttributes).length });
          } else {
            // Keep other operations unchanged
            newOps.push(op);
          }
          newOps.push({ retain: JSON.stringify(referenceAttributes).length });
        });

        // Replace the original ops with the modified ones
        delta.ops = newOps;
      };
      quillRef.current.keyboard;


      quillRef.current.clipboard.addMatcher("A", (node, delta) => {
        const element = node as HTMLElement;
        const href = element.getAttribute("href");
        const rel = element.getAttribute("rel");
        const type: 'dofollow' | 'nofollow' = rel?.includes("nofollow") ? "nofollow" : "dofollow";

        
      
        if (href && rel) {
        
          const linkAttributes = {
            link: { href, type }, // Align with CustomLink's expected format
          };
      
          let newDelta = new Delta();
          delta.ops.forEach(op => {
            if (op.insert && typeof op.insert === "string") {
             
              newDelta.insert(op.insert, linkAttributes);
              // newDelta.retain(op.insert.length)
            } else {
              newDelta.insert(op.insert, op.attributes || {});
            }
          });
      
          return newDelta;
        }
      
        console.warn("Invalid link attributes found on element:", element);
        return delta; // Return the original delta if no valid link attributes are found
      });
      
      quillRef.current.clipboard.addMatcher("SPAN", (node, delta) => {
        const element = node as HTMLElement;
        if (element.tagName === "SPAN" && element.hasAttribute("data-ref-id")) {
          const referenceAttributes = processReferenceElement(element);
          updateDeltaWithReference(
            delta,
            referenceAttributes,
            referenceAttributes.linkText
          );
        }
        return delta;
      });

      if (initialContent) {
        quillRef.current.clipboard.dangerouslyPasteHTML(initialContent);
      }

      const updateContent = () => {
        const semanticHTML = quillRef.current?.root.innerHTML || "";
        const HTML = quillRef.current?.getSemanticHTML?.() || semanticHTML;
        const cleanedHTML = cleanQuilHTML(HTML);

        setHtmlContent(cleanedHTML);
        onTextChange?.(cleanedHTML);
      };

      quillRef.current.on("text-change", updateContent);
      updateContent();

      quillRef.current.on("selection-change", () => {
        onSelectionChange?.();
      });

      if (ref) (ref as any).current = quillRef.current;
    }

    // Enable editing for context cards
    const handleCardClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const card = target.closest(".context-card"); // Ensure it's a context card

      if (card) {
        const title = card.getAttribute("data-title") || "";
        const content = card.getAttribute("data-content") || "";
        const type = card.getAttribute("data-type") || "";

        // Set the selected card data for editing
        setSelectedCardData({ title, content, type });
        setOpenDialog(true); // Open dialog for editing card

        event.preventDefault(); // Prevent further propagation
      }
    };
   
    const container = containerRef.current;
    container.addEventListener("click", handleCardClick);
    container.addEventListener("click", handleReferenceClick);
    // / Add word count display to the toolbar
    const toolbar = containerRef.current.querySelector(".ql-toolbar");
    if (toolbar && !toolbar.querySelector(".ql-word-count")) {
      const wordCountDiv = document.createElement("div");
      wordCountDiv.className = "ql-word-count";
      wordCountDiv.textContent = `Words: ${wordCount}`;
      toolbar.appendChild(wordCountDiv);
    }
    return () => {
      container.removeEventListener("click", handleCardClick);
      if (ref && typeof ref !== "function") {
        ref.current = null;
      }
      container.removeEventListener("click", handleReferenceClick);
    };
  }, [containerRef, ref, initialContent, readOnly, htmlContent]); // Add htmlContent to dependencies

  // Update the word count display when wordCount state changes
  useEffect(() => {
    const wordCountElement = document.querySelector(".ql-word-count");
    if (wordCountElement) {
      wordCountElement.textContent = `Words: ${wordCount}`;
    }
  }, [wordCount]);
  // Function to get the current selection range
  const getSelectionRange = () => {
    return selectionRange.current;
  };

  // Function to set the selection range
  const setSelectionRange = (range: { index: number; length: number }) => {
    selectionRange.current = range;
  };

  const handleFAQsChange = useCallback((updatedFAQs: FAQ[]) => {
    faqState.current = updatedFAQs;
    // setFaqState(updatedFAQs)

    // Save or process the FAQs as needed
  }, []);

  const ImageDialogComponent = (
    <ImageDialog
      open={openImageDialog}
      onClose={() => setOpenImageDialog(false)}
      onInsert={(details) => {
        if (quillRef.current) {
          const range = getSelectionRange();

          if (range) {
            quillRef.current.insertEmbed(range.index, "imageBlot", details);
          }
        }
        setOpenImageDialog(false);
      }}
    />
  );
  return {
    quillRef,
    openDialog,
    setOpenDialog,
    selectedCardData,
    setSelectedCardData,
    getSelectionRange, // Exported function
    setSelectionRange, // Exported function
    ImageDialogComponent,
    handleUpdateReference,
    isModalOpen,
    closeModal,
    handleInsertReference,
    referenceToEdit,
    state,
    editReference,
    handleDeleteReference,
    faqState,
    handleFAQsChange,
  };
};

export default useQuillEditor;
