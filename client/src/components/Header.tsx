import React, { useState } from 'react';
import SpotifySignInButton from './SpotifySignInButton';
import { styled } from '@mui/material';
import { useAppState } from '../overmind';

import { ReactComponent as SettingsIconRaw } from '../assets/settings.svg';
import { SettingsMenu } from './right-menus/SettingsMenu';

export const Header: React.FC = () => {

    const { showHeader } = useAppState();
    const [ settingsIsOpen, setSettingsIsOpen ] = useState<boolean>(false);

    if (!showHeader) return <></>;

    return <><HeaderWrapper>
        <Left>
            <SettingsIcon onClick={() => setSettingsIsOpen(true)}/>
        </Left>
        <Center>
            <h3>Music Quiz</h3>
        </Center>
        <Right>
            <SpotifySignInButton/>
        </Right>
    </HeaderWrapper>

    <SettingsMenu
        open={settingsIsOpen}
        onClose={() => setSettingsIsOpen(false)}
    />
    </>;
};

export const Left: React.FC<{children: JSX.Element | JSX.Element[]}> = ({ children }) => {
    return <div className='left'>{children}</div>;
};

export const Center: React.FC<{children: JSX.Element | JSX.Element[]}> = ({ children }) => {
    return <div className='center'>{children}</div>;
};

export const Right: React.FC<{children: JSX.Element | JSX.Element[]}> = ({ children }) => {
    return <div className='right'>{children}</div>;
};

const HeaderWrapper = styled('div')(({
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    padding: '10px 10px',
    color: 'white',

    '.left': {
        flex: '0 1 200px',
        display: 'flex',
        justifyContent: 'flex-start',
    },

    '.center': {
        flex: '1 1 auto',
        display: 'flex',
        justifyContent: 'center',
    },

    '.right': {
        flex: '0 1 200px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

const SettingsIcon = styled(SettingsIconRaw)(({ theme }) => ({
    width: '25px',
    height: '25px',
    cursor: 'pointer',
    transition: '200ms',
    color: 'white',

    '&:hover': {
        scale: '1.05',
        color: theme.palette.primary.main,
    },
}));
