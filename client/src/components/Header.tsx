import React from 'react';
import SpotifySignInButton from './SpotifySignInButton';
import { styled } from '@mui/material';

const Header: React.FC = () => {

    return <HeaderWrapper>
        <SpotifySignInButton/>
    </HeaderWrapper>;
};

const HeaderWrapper = styled('div')(({
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: '10px 10px',
}));

export default Header;
