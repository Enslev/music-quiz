import React from 'react';
import SpotifySignInButton from './SpotifySignInButton';
import { styled } from '@mui/material';

const HeaderComponent: React.FC = () => {

    return <Header>
        <SpotifySignInButton/>
    </Header>;
};

export default HeaderComponent;

const Header = styled('div')`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding: 10px 10px;
`;
