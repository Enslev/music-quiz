import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import { config } from './overmind'

import SpotifyCallbackPage from './pages/SpotifyCallbackPage';

const overmind = createOvermind(config)

const router = createBrowserRouter([
  { path: '/', Component: App, },
  { path: '/auth/callback', Component: SpotifyCallbackPage }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider value={overmind}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
