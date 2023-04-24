import React from 'react';
import { ReactComponent as SpotifyLogoRaw } from '../assets/spotify-logo.svg';
import { useActions, useAppState } from '../overmind';
import { styled } from '@mui/material';

const SpotifySignInButton: React.FC = () => {
    const login = () => {
        window.location.href = 'http://localhost:9001/api/auth/redirect';
    };
    const isLoggedIn = useAppState().isLoggedIn;
    const { logout } = useActions().auth;

    const onClick = () => {
        if (isLoggedIn) {
            logout();
        } else {
            login();
        }
    };

    return <SpotifyLogin onClick={onClick}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
            <SpotifyLogo/>
            {isLoggedIn ?
                <span>Sign out</span> :
                <span>Sign in with Spotify</span>
            }
        </span>
    </SpotifyLogin>;
};

const SpotifyLogin = styled('button')(({
    backgroundColor: '#1DB954',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',

    '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#1aa34a',

        '&:active': {
            backgroundColor: '#168d40',
        },
    },
}));

const SpotifyLogo =  styled(SpotifyLogoRaw)(({
    width: '30px',
    height: '30px',
    marginRight: '10px',
}));

export default SpotifySignInButton;
