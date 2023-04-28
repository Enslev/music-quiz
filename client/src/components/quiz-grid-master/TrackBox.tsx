
import React, { useState } from 'react';
import { Category, Track } from '../../overmind/actions/api/quiz';
import { styled } from '@mui/material';
import PlayTrackMenu from './PlayTrackMenu';


interface Props {
    category: Category;
    track: Track;
    revealed: boolean;
}

const TrackBox: React.FC<Props> = ({
    track,
    category,
    revealed,
}) => {

    const [hasHovered, setHasHovered] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    return (<>
        <BoxWrapper
            className={(revealed ? 'revealed': 'hidden') + (hasHovered ? ' hasHovered' : '')}
            onMouseEnter={() => setHasHovered(true)}
            onClick={() => setMenuOpen(true)}
        >
            <span className='points'>{track.points}</span>
            <span className='title'>{track.title}</span>
            <span className='artist'>{track.artist}</span>
        </BoxWrapper>

        <PlayTrackMenu
            category={category}
            track={track}
            open={menuOpen}
            handleClose={() => setMenuOpen(false)}
        />
    </>);
};

const BoxWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    padding: '5px',

    '@keyframes gradient-enter': {
        from: {
            backgroundPosition: '0% 0%',
        },
        to: {
            backgroundPosition: '100% 0%',
        },
    },


    '@keyframes gradient-leave': {
        from: {
            backgroundPosition: '100% 0%',
        },
        to: {
            backgroundPosition: '0% 0%',
        },
    },


    '&.hidden': {
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.main} 40%)`,
        backgroundSize: '200% 100%',

        '&.hasHovered': {
            animation: 'gradient-leave 200ms ease forwards',
        },

        '&:hover': {
            animation: 'gradient-enter 500ms ease forwards',
        },
    },

    '&.revealed': {
        background:  theme.palette.background.default,
    },

    '.points': {
        fontSize: '10px',
    },

    '.artist': {
        fontSize: '10px',
    },

    '.title': {
        fontSize: '15px',
    },

}));


export default TrackBox;
