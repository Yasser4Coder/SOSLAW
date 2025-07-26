import { useEffect } from "react";

export const useFontLoader = () => {
  useEffect(() => {
    // Ensure Readex Pro font is loaded
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap";
      link.rel = "stylesheet";
      link.type = "text/css";

      // Check if the font is already loaded
      const existingLink = document.querySelector('link[href*="Readex+Pro"]');
      if (!existingLink) {
        document.head.appendChild(link);
      }
    }
  }, []);
};
