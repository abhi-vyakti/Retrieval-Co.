/**
 * api.js - Central API helper that automatically attaches the Authorization header.
 * Import `apiFetch` in place of raw `fetch` for all protected API calls.
 */
export function apiFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
}
