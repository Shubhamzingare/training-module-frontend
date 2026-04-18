// Central API configuration
// In production, set REACT_APP_API_URL to your deployed backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000');

export default API_BASE_URL;
