import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DialogProvider } from './providers/DialogProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </React.StrictMode>
);
