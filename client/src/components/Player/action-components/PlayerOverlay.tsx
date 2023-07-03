import { Box, Fade, Slide, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Props {
    open: boolean,
    children: JSX.Element | JSX.Element[] | null
}

export const PlayerOverlay: React.FC<Props> = (props) => {

    const { open, children } = props;
    const [direction, setDirection] = useState<'up' | 'down'>('up');
    const [fadeOpen, setFadeOpen] = useState<boolean>(open);

    useEffect(() => {
        if (open) {
            setFadeOpen(true);
        } else {
            setTimeout(() => setFadeOpen(false), 1000 * 0.5);
        }
    }, [open]);

    return <>
        <Slide
            in={open}
            timeout={1000}
            direction={direction}
            onEntered={() => setDirection('down')}
            onExited={() => setDirection('up')}
        >
            <Overlay>
                {children}
            </Overlay>
        </Slide>
        <Fade in={fadeOpen}
            timeout={500}
        >
            <Box
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
    </>;

};

const Overlay = styled('div')(({ theme }) => ({
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    background:  `linear-gradient(145deg, ${theme.palette.background.default} 25%, ${theme.palette.primary.main}  75%)`,
    zIndex: 100,
    color: 'white',
}));
