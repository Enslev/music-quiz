import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SpotifyCallbackPage from './pages/SpotifyCallbackPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index Component={LandingPage} />
          <Route path="login" Component={LoginPage} />
          <Route path="auth/callback" Component={SpotifyCallbackPage} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
