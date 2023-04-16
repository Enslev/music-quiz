import React from 'react';
import styled from 'styled-components';
import { ReactComponent as SpotifyLogoRaw } from '../assets/spotify-logo.svg';
import { useActions, useAppState } from '../overmind';

function SpotifySignInButton() {
    const login = () => {
        window.location.href = 'http://localhost:9001/api/spotify/auth';
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
}

const SpotifyLogin = styled.button`
    background-color: #1DB954;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;

    &:hover {
        cursor: pointer;
        background-color: #1aa34a;

        &:active {
            background-color: #168d40
        }
    }
`;

const SpotifyLogo =  styled(SpotifyLogoRaw)`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

export default SpotifySignInButton;
