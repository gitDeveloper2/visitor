import Quill from "quill";
import Inline from "quill/blots/inline";

export class ReferenceBlot extends Inline {
  static blotName = 'reference';
  static tagName = 'span';
    static className = "ql-refference"; // Custom class

  storage = null;
  // linkText: element.getAttribute('data-linktext') || undefined,
  // Create a new reference blot with the provided reference data
  static create(referenceData: any) {
    const node = super.create();
    // Set custom attributes to store reference details
    node.setAttribute('data-ref-id', referenceData.id);
    node.setAttribute('data-type', referenceData.type);
    node.setAttribute('data-kind', referenceData. kind|| '');
    node.setAttribute('data-author-firstname', referenceData. authorFirstName|| '');
    node.setAttribute('data-author-lastname', referenceData. authorLastName || '');
    node.setAttribute('data-title', referenceData.title);
    node.setAttribute('data-publisher', referenceData.publisher || '');
    node.setAttribute('data-date', referenceData.date || '');
    node.setAttribute('data-url', referenceData.url || '');
    node.setAttribute('data-linktext', referenceData.linkText || '');

   
    
    // Add extra fields if available
    if (referenceData.journalName) node.setAttribute('data-journal-name', referenceData.journalName);
    if (referenceData.volume) node.setAttribute('data-volume', referenceData.volume);
    if (referenceData.issue) node.setAttribute('data-issue', referenceData.issue);
    if (referenceData.pageRange) node.setAttribute('data-page-range', referenceData.pageRange);
    if (referenceData.doi) node.setAttribute('data-doi', referenceData.doi);
    if (referenceData.websiteName) node.setAttribute('data-website-name', referenceData.websiteName);
    

    return node;
  }

  // Retrieve reference data from the node
  static formats(node: HTMLElement) {
    return {
      id: node.getAttribute('data-ref-id'),
      type: node.getAttribute('data-type'),
      authorFirstName: node.getAttribute('data-author-firstname'),
      authorLastName: node.getAttribute('data-author-lastname'),
      title: node.getAttribute('data-title'),
      publisher: node.getAttribute('data-publisher'),
      date: node.getAttribute('data-date'),
      url: node.getAttribute('data-url'),
      journalName: node.getAttribute('data-journal-name'), // Added journalName
      volume: node.getAttribute('data-volume'), // Added volume
      issue: node.getAttribute('data-issue'), // Added issue
      pageRange: node.getAttribute('data-page-range'), // Added pageRange
      doi: node.getAttribute('data-doi'), // Added DOI
      websiteName: node.getAttribute('data-website-name'), // Added websiteName
      linkText:node.getAttribute('data-linktext'), // Added websiteName
      kind:node.getAttribute('data-kind'), // Added websiteName
     

    };
  }

  // Update the node attributes when formatting changes
  format(name: string, value: any) {
    if (name === 'reference' && value) {
      this.domNode.setAttribute('data-ref-id', value.id);
      this.domNode.setAttribute('data-type', value.type);
      this.domNode.setAttribute('data-author-firstname', value.authorFirstName);
      this.domNode.setAttribute('data-author-lastname', value.authorLastName);
      this.domNode.setAttribute('data-title', value.title);
      this.domNode.setAttribute('data-publisher', value.publisher);
      this.domNode.setAttribute('data-date', value.date);
      this.domNode.setAttribute('data-url', value.url);
      this.domNode.setAttribute('data-linktext', value.linkText);
      this.domNode.setAttribute('data-kind', value.kind);



      // Set extra fields if available
      if (value.journalName) this.domNode.setAttribute('data-journal-name', value.journalName);
      if (value.volume) this.domNode.setAttribute('data-volume', value.volume);
      if (value.issue) this.domNode.setAttribute('data-issue', value.issue);
      if (value.pageRange) this.domNode.setAttribute('data-page-range', value.pageRange);
      if (value.doi) this.domNode.setAttribute('data-doi', value.doi);
      if (value.websiteName) this.domNode.setAttribute('data-website-name', value.websiteName);

    } else {
      super.format(name, value);
    }
  }

  length() {
    const content = this.domNode.textContent;
    const l = content?.length || 3;
    return l; // Correctly calculate length
  }

  deleteAt(index: number, length: number) {
    
    this.remove(); // Remove the blot from the editor
  }
}
