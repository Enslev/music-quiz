import React from 'react';
import SpotifySignInButton from './SpotifySignInButton';
import { styled } from '@mui/material';
import { useAppState } from '../overmind';

const Header: React.FC = () => {

    const { showHeader } = useAppState();

    if (!showHeader) return <></>;

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
