import BlockEmbed from "quill/blots/embed";


export class ContextCardBlot extends BlockEmbed {
  static blotName = "contextCard";
  static tagName = "div";
  static className = "context-card";

  static create(value: { title: string; content: string; type: string }) {
   
    const node = super.create()as HTMLElement;
    node.setAttribute("data-title", value.title);
    node.setAttribute("data-content", value.content);
    node.setAttribute("data-type", value.type);
    // Add contextual styles
    node.classList.add(value.type);

    // Inner HTML for display in editor
    node.innerHTML = `
      <div class="icon">${ContextCardBlot.getIcon(value.type)}</div>
      <div class="content">
        <h4>${value.title}</h4>
        <p>${value.content}</p>
      </div>
    `;
    return node;
  }

  static getIcon(type: string): string {
    switch (type) {
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  }

  static value(node: HTMLElement) {
    return {
      title: node.getAttribute("data-title") || "",
      content: node.getAttribute("data-content") || "",
      type: node.getAttribute("data-type") || "info",
    };
  }
}
