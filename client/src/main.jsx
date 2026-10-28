import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './routes';
import 'semantic-ui-css/semantic.min.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
