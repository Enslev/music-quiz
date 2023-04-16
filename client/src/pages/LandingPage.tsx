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
        if (state.spotifyAccessToken == null) {
            navigate('/login');
        }
    }, [navigate, state.spotifyAccessToken]);
    return <>
        <h1>Landing</h1>
        <Button variant='contained' onClick={clickbutton}>Load quiz</Button>
    </>;
}

export default LandingPage;
