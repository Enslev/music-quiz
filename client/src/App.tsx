import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SpotifyCallbackPage from './pages/SpotifyCallbackPage';
import HeaderComponent from './components/HeaderComponent';
import EditQuizPage from './pages/EditQuizPage';
import PlayerScreenPage from './pages/PlayerScreenPage';

function App() {

    return (
        <BrowserRouter>
            <HeaderComponent/>
            <Routes>
                <Route path="/" Component={LandingPage} />
                <Route path="login" Component={LoginPage} />
                <Route path="quiz/:quizId/edit" Component={EditQuizPage} />
                <Route path="quiz/:quizId" Component={PlayerScreenPage} />
                <Route path="auth/callback" Component={SpotifyCallbackPage} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
