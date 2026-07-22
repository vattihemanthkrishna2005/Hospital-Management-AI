import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Set Axios Base URL for Azure Production vs Local Dev Proxy
const liveBackendUrl = 'https://medicare-backend-api.happybeach-ad1e66f4.eastasia.azurecontainerapps.io';
if (window.location.hostname.includes('azurestaticapps.net') || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || liveBackendUrl;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
