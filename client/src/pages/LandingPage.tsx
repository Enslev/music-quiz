import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import { Button } from '@mui/material';

function LandingPage() {

    const state = useAppState();
    const navigate = useNavigate();

    const { getQuizzes } = useActions().api.quiz;

    const clickbutton = async () => {
        await getQuizzes();
    };

    // Send user to login if no accessToken is found
    useEffect(() => {
        if (!state.isLoggedIn) {
            navigate('/login');
        }
    }, [navigate]);
    return <>
        <h1>Your quizzes</h1>
        <Button variant='contained' onClick={clickbutton}>Get quizzes</Button>
    </>;
}

export default LandingPage;
