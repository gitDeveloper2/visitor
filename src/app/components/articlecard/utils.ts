type Colors ="default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
export const getRandomColor = (): Colors => {
    const colors: Colors[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];
    const randomInteger = Math.floor(Math.random() * colors.length);
    return colors[randomInteger];
  }
  