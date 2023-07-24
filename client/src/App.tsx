import React, { useEffect } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SpotifyCallbackPage from './pages/SpotifyCallbackPage';
import { Header } from './components/Header';
import EditQuizPage from './pages/EditQuizPage';
import PlayerScreenPage from './pages/PlayerScreenPage';
import { styled, useTheme, withStyles } from '@mui/material';
import { SessionHostPage } from './pages/SessionHostPage';
import { useActions, useReaction } from './overmind';
import { JoinSessionPage } from './pages/JoinSessionPage';
import { ToastContainer } from 'react-toastify';


const App: React.FC = () => {
    const theme = useTheme();

    const reaction = useReaction();
    const { updateEffectsApiKey } = useActions().auth;

    useEffect(() => reaction(
        ({ token }) => token,
        updateEffectsApiKey,
    ));

    return (
        <BrowserRouter>
            <style>{`body { background-color: ${theme.palette.background.default} }`}</style>
            <Header/>
            <Routes>
                <Route path="/" Component={LandingPage} />
                <Route path="login" Component={LoginPage} />
                <Route path="session/:sessionCode/host" Component={SessionHostPage} />
                <Route path="quiz/:quizId/edit" Component={EditQuizPage} />
                <Route path="session" Component={JoinSessionPage} />
                <Route path="session/:sessionCode" Component={PlayerScreenPage} />
                <Route path="auth/callback" Component={SpotifyCallbackPage} />
                <Route path="*" element={<div>Not found</div>} />
            </Routes>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                newestOnTop={true}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </BrowserRouter>
    );
};

export default App;
