// Central API configuration
// In development: defaults to localhost:5000
// In production: set VITE_API_URL env variable on Vercel
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
