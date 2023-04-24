import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SpotifyCallbackPage from './pages/SpotifyCallbackPage';
import HeaderWrapper from './components/Header';
import EditQuizPage from './pages/EditQuizPage';
import PlayerScreenPage from './pages/PlayerScreenPage';
import { useTheme } from '@mui/material';

const App: React.FC = () => {
    const theme = useTheme();

    return (
        <BrowserRouter>
            <style>{`body { background-color: ${theme.palette.background.default} }`}</style>
            <HeaderWrapper/>
            <Routes>
                <Route path="/" Component={LandingPage} />
                <Route path="login" Component={LoginPage} />
                <Route path="quiz/:quizId/edit" Component={EditQuizPage} />
                <Route path="quiz/:quizId" Component={PlayerScreenPage} />
                <Route path="auth/callback" Component={SpotifyCallbackPage} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
