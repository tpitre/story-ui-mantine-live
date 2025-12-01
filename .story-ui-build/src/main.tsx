/**
 * Production App Entry Point
 *
 * This is the main entry point for the Story UI production app.
 * Provider configuration is read from story-ui.config.js
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import App from './App';
import './index.css';

// Mount the app
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <MantineProvider><App /></MantineProvider>
  </React.StrictMode>
);
