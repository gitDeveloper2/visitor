export function getColor(index: number): string {
    const colors = ["#1976d2", "#2e7d32", "#d32f2f", "#ff9800", "#9c27b0", "#0097a7"];
    return colors[index % colors.length];
  }