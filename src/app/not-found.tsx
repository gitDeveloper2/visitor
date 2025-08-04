import logger from "../utils/logger/customLogger";

// app/not-found.tsx
export default function NotFound() {
  // logger.warn("Requested page not found")
    return (
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  }
  