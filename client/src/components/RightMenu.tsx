import React from 'react';
import { Slide, Fade, Box, styled } from '@mui/material';

interface Props {
    open: boolean,
    children: JSX.Element | JSX.Element[],
    onClose?: () => void;
}

export const RightMenu: React.FC<Props> = (props) => {

    const {
        open,
        onClose = () => {return;},
        children,
    } = props;

    return (<>
        <Fade in={open}>
            <Box
                onClick={onClose}
                sx={{
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 99,
                }}
            />
        </Fade>
        <Slide direction='left' in={open}>
            <ModalContainer>
                {children}
            </ModalContainer>
        </Slide>
    </>);
};

export const RightMenuHeader: React.FC<{children: JSX.Element | JSX.Element[]}> = ({ children }) => {
    return <div className='header'>{children}</div>;
};

export const RightMenuContent: React.FC<{children: JSX.Element | JSX.Element[]}> = ({ children }) => {
    return <div className='content'>{children}</div>;
};

export const RightMenuFooter: React.FC<{children: JSX.Element | JSX.Element[]}> = ({ children }) => {
    return <div className='footer'>{children}</div>;
};

const ModalContainer = styled('div')(({ theme }) => ({
    position: 'fixed',
    height: '100vh',
    maxHeight: '100vh',
    overflowY: 'hidden',
    boxSizing: 'border-box',
    top: '0px',
    right: '0px',
    backgroundColor: theme.palette.custom.darkerBackground,
    width: '500px',
    padding: '20px',
    color: 'white',
    zIndex: '100',

    display: 'flex',
    flexFlow: 'column',

    '.header': {
        flex: '0 1 auto',
    },

    '.content ': {
        flex: '1 1 auto',
    },

    '.footer  ': {
        flex: '0 1 auto',
    },

    webkitBoxShadow: '25px 0px 25px 20px #000000',
    boxShadow: '25px 0px 25px 20px #000000',
}));
