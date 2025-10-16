// Static authentication utility
// This file provides static credentials for API requests

// Static token for authentication
export const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluMTIzIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE2MTYyODAwLCJleHAiOjk5OTk5OTk5OTl9.8T3zaSHHsKC9jkdU_ZGTvO-Qe-UxNgBgVH7-QrMdOvs';

// Static user credentials
export const STATIC_USER = {
  id: 'admin123',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};

// Function to get authentication headers
export const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${STATIC_TOKEN}`,
    'Content-Type': 'application/json'
  };
};

// Function for authenticated fetch
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };
  
  return fetch(url, {
    ...options,
    headers
  });
};