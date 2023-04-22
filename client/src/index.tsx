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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
