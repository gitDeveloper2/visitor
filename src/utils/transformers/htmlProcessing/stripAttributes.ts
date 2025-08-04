import parse, { DOMNode, Element } from 'html-react-parser';

export const stripContentEditable = (domNode: DOMNode) => {
    if (domNode instanceof Element) { 
      if (domNode.attribs) { 
      if (domNode.attribs.contenteditable) { 
        delete domNode.attribs.contenteditable; } 
        
         } } 
    return domNode; 
  };
  
  export const stripStyles = (domNode: DOMNode, preserveClasses = false): DOMNode => {
    if (domNode instanceof Element) {
      if (domNode.attribs) {
        if (!preserveClasses) {
          delete domNode.attribs.class; // Only strip class if not preserving
        }
        delete domNode.attribs.style;
        // delete domNode.attribs.id;
      }
    }
    return domNode;
  };
  