import React from 'react';
import ReactDOM from 'react-dom/client';

import { GlobalStateProvider } from './utils/globalStateManager/globalStateInit';

import App from './App';
import reportWebVitals from './reportWebVitals';
import './services/translation/i18n';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
);

reportWebVitals();
