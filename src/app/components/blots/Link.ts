// Import Quill and the Link module
import Quill from 'quill';
const Link = Quill.import('formats/link') as any;

interface CustomLinkProp {
  href: string;
  type: 'dofollow' | 'nofollow';
}

// Utility function to sanitize and deduplicate the 'rel' attribute
function buildRelAttribute(baseRel: string, type: 'dofollow' | 'nofollow'): string {
  const parts = new Set(baseRel.split(' ').filter(Boolean)); // Split and deduplicate
  parts.add(type); // Add the custom type
  parts.add('noopener');
  parts.add('noreferrer');
  return Array.from(parts).join(' '); // Join back into a string
}

// Custom Link class extending Quill's Link module
export class CustomLink extends (Link as any) {
  static create(value: string | CustomLinkProp) {
    const node = super.create();
    
    if (typeof value === 'string') {
      // Treat the string as the href
      node.setAttribute('href', value);
      node.setAttribute('rel', buildRelAttribute('noopener noreferrer', 'nofollow'));
    } else if (typeof value === 'object' && value.href) {
      // Use the provided object to set attributes
      node.setAttribute('href', value.href);
      const rel = buildRelAttribute('noopener noreferrer', value.type || 'nofollow');
      node.setAttribute('rel', rel);
    } else {
      // Default case for invalid values
      node.setAttribute('href', '#');
      node.setAttribute('rel', buildRelAttribute('noopener noreferrer', 'nofollow'));
    }

    return node;
  }

  format(name: string, value: any) {
    if (name !== this.statics.blotName || !value) {
      super.format(name, value);
      return;
    }

    if (typeof value === 'string') {
      // Update the href directly
      this.domNode.setAttribute('href', value);
      this.domNode.setAttribute('rel', buildRelAttribute('noopener noreferrer', 'nofollow'));
    } else if (typeof value === 'object' && value.href) {
      // Update href and rel based on object properties
      this.domNode.setAttribute('href', value.href);
      const rel = buildRelAttribute('noopener noreferrer', value.type || 'nofollow');
      this.domNode.setAttribute('rel', rel);
    } else if (value === false) {
      // Remove attributes when the value is explicitly set to false
      this.domNode.removeAttribute('href');
      this.domNode.removeAttribute('rel');
    }
  }
}
