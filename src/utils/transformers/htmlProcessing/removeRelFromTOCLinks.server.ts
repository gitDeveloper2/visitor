import { JSDOM } from 'jsdom';
export  function removeRelFromTOCLinksServer(htmlString: string): string {
    if (typeof window !== 'undefined') {
      // In the browser, return the original string unmodified
      return htmlString;
    }
  
    // Import JSDOM dynamically to ensure it's only used in the server build
    
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;
  
    const tocHeaderParent = document.querySelector('#toc-header')?.parentElement;
    if (tocHeaderParent) {
      const tocLinks = tocHeaderParent.querySelectorAll('ol a[rel]');
      tocLinks.forEach(link => link.removeAttribute('rel'));
    }
  
    return dom.serialize();
  }