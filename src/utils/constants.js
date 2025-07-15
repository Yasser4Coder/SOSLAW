// Application constants
export const APP_NAME = "SOSLAW";
export const APP_DESCRIPTION = "Professional legal services and solutions";

// Navigation items
export const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// Feature cards data
export const FEATURES = [
  {
    icon: "check-circle",
    title: "Professional Service",
    description: "Expert legal advice and solutions tailored to your needs.",
    iconColor: "blue",
  },
  {
    icon: "lightning-bolt",
    title: "Fast & Efficient",
    description: "Quick turnaround times and efficient service delivery.",
    iconColor: "green",
  },
  {
    icon: "users",
    title: "Client Focused",
    description:
      "Dedicated support and personalized attention for every client.",
    iconColor: "purple",
  },
];

// API endpoints (if needed later)
export const API_ENDPOINTS = {
  base: import.meta.env.VITE_API_URL || "http://localhost:3000",
  services: "/api/services",
  contact: "/api/contact",
};
