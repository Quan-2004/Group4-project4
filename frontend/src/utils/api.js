// frontend/src/utils/api.js
// Helper to provide API base URL for the frontend.
// Behavior:
// - If REACT_APP_API_URL is set, use that (append /api) -> e.g. https://api.example.com/api
// - Else if NODE_ENV === 'production', default to the Render URL
// - Else (development) return empty string so code can use relative '/api' and React proxy will work

const envRaw = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
const env = envRaw ? envRaw.replace(/\/$/, '') : '';
const prodDefault = 'https://group4-project4b6.onrender.com';

let API_BASE = '';
if (env) {
  // If the provided REACT_APP_API_URL already contains '/api' at the end, use it as-is.
  API_BASE = env.endsWith('/api') ? env : `${env}/api`;
} else if (process.env.NODE_ENV === 'production') {
  API_BASE = `${prodDefault}/api`;
} else {
  API_BASE = '';
}

export default API_BASE;
