// Central API configuration
// In development: defaults to localhost:5000
// In production (Vercel): uses the same origin automatically because Vercel hosts both!
export const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
