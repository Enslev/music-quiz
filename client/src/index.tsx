import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'overmind-react';
import { config } from './overmind';
import { createOvermind } from 'overmind';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles';

const overmind = createOvermind(config);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
    <ThemeProvider theme={theme}>
        <Provider value={overmind}>
            <App />
        </Provider>
    </ThemeProvider>,
);

reportWebVitals();
