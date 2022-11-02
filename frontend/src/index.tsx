import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Global State Manager
import "./services/translation/i18l";
import { GlobalStateProvider } from './utils/globalStateManager/globalStateInit';
=======

import App from 'App';
import reportWebVitals from 'reportWebVitals';

import 'index.css';
import 'services/translation/i18n';
>>>>>>> ec5059aaf3971f9a44a4563bae2eaa4e9d85bc14

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
=======
    <App />
>>>>>>> ec5059aaf3971f9a44a4563bae2eaa4e9d85bc14
  </React.StrictMode>
);

reportWebVitals();
