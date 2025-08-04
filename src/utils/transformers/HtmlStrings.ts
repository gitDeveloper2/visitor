import * as cheerio from 'cheerio';
import { removeRelFromTOCLinksServer } from './htmlProcessing/removeRelFromTOCLinks.server';


export function removeRelFromTOCLinks(htmlString: string): string {

  const $ = cheerio.load(htmlString);

  // Find the <h2 id="toc-header"> and get its parent element
  const tocParent = $('h2#toc-header').parent();

  // Ensure we’re only selecting <ol> elements within the same parent container
  tocParent.find('ol').each((_, olElement) => {
    // Remove rel attribute from all <a> tags within <ol>
    $(olElement).find('a[rel]').each((_, element) => {
      $(element).removeAttr('rel');
    });
  });
   // Remove all empty <p></p> tags
   $('p').each((_, pElement) => {
    if (!$(pElement).text().trim()) {  // If the <p> tag is empty
      $(pElement).remove();  // Remove it
    }
  });

  return $('body').html() 
}








export const normalizeHTML = (html: string) => {
    return removeTargetAttribute( removeEmptyParagraphsFromImages( cleanEmptyTags(html
      .replace(/\n+/g, '\n') // Replace multiple new lines with a single one
      .replace(/>\s+</g, '><') // Remove spaces between HTML tags
      .trim()))); // Trim leading/trailing whitespace
  };

  // function cleanEmptyTags(html: string): string {
  //   return html.replace(/<p><br><\/p>/g, "");
  // }
  function cleanEmptyTags(html: string): string {
    
    return html.replace(/<p>(\s|<br>)*<\/p>/g, "");
  }
  

  function removeTargetAttribute(htmlContent: string): string {
    const $ = cheerio.load(htmlContent,{ xmlMode: true });
  
    // Find all instances of <h2 id="toc-header">
    const tocHeaders = $('h2#toc-header');
   
  
    // Loop through each TOC header
    tocHeaders.each((_, element) => {
      const tocHeader = $(element);
  
      // Check if the next sibling is <ol id="toc">
      if (tocHeader.next().is('ol')) {
        const tocList = tocHeader.next();
  
        // Log for debugging
    
  
        // Remove target="_blank" from all <a> elements in this <ol> list
        tocList.find('a').each((_, linkElement) => {
          const link = $(linkElement);
          if (link.attr('target') === '_blank') {
            link.removeAttr('target');
          }
        });
      }
    });
  
    // Return the modified HTML as a string
    return $.html();
  }
  

  export function wrapCodeWithPre(htmlString: string): string {
    // Create a temporary DOM element to manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
  
    // Select all <code> elements
    const codeElements = tempDiv.querySelectorAll('code');
  
    // Wrap each <code> element with <pre> if not already wrapped
    codeElements.forEach((codeElement) => {
      if (codeElement.parentElement?.tagName !== 'PRE') {
        const preElement = document.createElement('pre');
        preElement.appendChild(codeElement.cloneNode(true));
        codeElement.parentElement?.replaceChild(preElement, codeElement);
      }
    });
  
    // Return the modified HTML as a string
    return tempDiv.innerHTML;
  }
  
  export function removeEmptyParagraphsFromImages(html: string): string {
    // Remove paragraphs that only contain an image with specific attributes (src, caption, alt, attribution)
    return html.replace(
      /<p>\s*(<img src="[^"]+" caption="[^"]+" alt="[^"]+" attribution="[^"]+"[^>]*>)\s*<\/p>/g, 
      '$1'
    );
  }
  /**
 * Extracts clean text content from HTML for analysis.
 * @param htmlContent - The HTML string to extract text from.
 * @returns A plain text string without HTML tags.
 */
  

  /**
   * Extracts clean text content from HTML for analysis, using cheerio for server-side compatibility.
   * @param htmlContent - The HTML string to extract text from.
   * @returns A plain text string without HTML tags.
   */
  export function extractTextContentFromHTML(htmlContent: string): string {
    // Load the HTML content using cheerio
    const $ = cheerio.load(htmlContent);
  
    // Remove script and style elements
    $("script, style").remove();
  
    // Extract the text content and normalize whitespace
    const textContent = $.text();
    const cleanText = textContent.replace(/\s+/g, " ").trim();
  
    return cleanText;
  }
  


  export function analyzeText(text) {
    const sentences = text.split(/[.!?]/).filter(Boolean);
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);
    return {
        sentenceCount: sentences.length,
        avgSentenceLength: words.length / sentences.length,
        lexicalDiversity: uniqueWords.size / words.length,
        wordCount: words.length,
    };
}

export const cleanQuilHTML = (html: string) => {
  return html.replace(/&nbsp;/g, ' ').trim();
};


export type InsertAdMarkersOptions = {
  skipFirst?: number;
  interval?: number;
  maxAds?: number;
  adPlaceholders?: string[]; // You can skip this if using comment-based detection
  tagName?: string;
};

export const insertAdMarkers = (
  html: string,
  options: InsertAdMarkersOptions = {}
): string => {
  const {
    skipFirst = 2,
    interval = 2,
    maxAds = Infinity,
    tagName = "h2",
  } = options;

  let hCounter = 0;
  let adCounter = 0;

  const regex = new RegExp(`<${tagName}(.*?)>(.*?)<\\/${tagName}>`, "gi");

  return html.replace(regex, (match, attrs = "", content) => {
    hCounter++;

    let tag = `<${tagName}${attrs}>${content}</${tagName}>`;

    if (
      hCounter > skipFirst &&
      ((hCounter - skipFirst - 1) % interval === 0) &&
      adCounter < maxAds
    ) {
      const marker = `<!--AD_UNIT_${adCounter + 1}-->`;
      tag += marker;
      adCounter++;
    }

    return tag;
  });
};






export const wrapH2InSections = (html: string): string => {
 
    let h2Count = 0;
    let totalH2Count = 0;

    // Count the number of h2 tags in the HTML
    const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/g);
    if (h2Matches) {
        totalH2Count = h2Matches.length;
    }

    // Split the HTML into sections around each <h2>
    let sections = html.split(/(<h2[^>]*>.*?<\/h2>)/g);

    // Iterate through the sections and wrap content between <h2> tags in <section>
    let wrappedHtml = sections.reduce((acc, part, index) => {
        if (part.startsWith("<h2")) {
            h2Count++;

            // For the first <h2>, wrap it with <section>
            if (h2Count === 1) {
                acc += `<section>${part}`;
            }
            // For all middle <h2> tags, wrap <h2> and its following content
            else if (h2Count < totalH2Count) {
                acc += `</section><section>${part}`;
            }
            // For the last <h2>, wrap it with <section> but no closing section tag yet
            else if (h2Count === totalH2Count) {
                acc += `</section><section>${part}`;
            }
        } else {
            // Append content after the <h2> tag
            acc += part;
        }

        return acc;
    }, '');

    // Ensure that the last section is properly closed
    if (h2Count > 0) {
        wrappedHtml += '</section>';
    }

    return wrappedHtml;
};





