import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

// Check if the element exists before trying to render
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
  // Create a fallback message
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Could not find root element. Please check your index.html file.</div>';
}