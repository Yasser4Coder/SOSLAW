// API Configuration
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// Remove trailing slash to prevent double slashes in URLs
const API_BASE_URL = rawApiUrl.replace(/\/$/, '');

export default API_BASE_URL;
