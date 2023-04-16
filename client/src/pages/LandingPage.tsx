import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../overmind';

function LandingPage() {

    const state = useAppState();
    const navigate = useNavigate();

    // Send user to login if no accessToken is found
    useEffect(() => {
      if (state.spotifyAccessToken == null) {
        navigate('/login');
      }
    }, [navigate, state.spotifyAccessToken]);
    return <>
        Landing
    </>;
}

export default LandingPage;
