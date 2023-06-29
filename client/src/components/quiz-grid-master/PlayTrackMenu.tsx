import React from 'react';
import RightMenu from '../RightMenu';
import { Category, Track } from '../../overmind/effects/api/quizzes/types';
import { styled } from '@mui/material';
import { useAppState, useActions } from '../../overmind';

import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';

interface Props {
    category?: Category,
    track?: Track,
    open: boolean,
    handleClose: () => void;
}

const PlayTrackMenu: React.FC<Props> = ({
    category,
    track,
    open,
    handleClose,
}) => {

    const { spotifyPlayer } = useAppState();
    const { play, pause } = useActions().spotify;

    if (!category || !track) return <></>;

    const handleStop = (e: React.MouseEvent) => {
        e.stopPropagation();
        pause();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        play({ trackUri: track.trackUrl, position: track.startPosition });
    };


    return (
        <RightMenu
            open={open}
            handleClose={handleClose}
        >
            <TrackSelectedWrapper>
                <div>
                    <span>{category.title} </span> - <span>{track.points} </span>
                </div>
                <span className='title'>{track.title}</span>
                <span className='artist'>{track.artist}</span>

                <Center>
                    { (!spotifyPlayer.isPlaying || spotifyPlayer.currentlyPlaying != track.trackUrl) &&
                    <PlayIcon onClick={handlePlay}/>
                    }

                    { (spotifyPlayer.isPlaying && spotifyPlayer.currentlyPlaying == track.trackUrl) &&
                    <PauseIcon onClick={handleStop}/>
                    }
                </Center>

            </TrackSelectedWrapper>

        </RightMenu>
    );
};

const TrackSelectedWrapper = styled('div')(({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: 'white',

    '.title': {
        fontWeight: 600,
        fontSize: '30px',
    },

    '.artist': {
        fontSize: '20px',
    },
}));

const PlayIcon = styled(PlayIconRaw)(({
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    transition: '200ms',
    margin: '30px 0px',

    '&:hover': {
        scale: '1.05',
    },
}));

const PauseIcon = styled(PauseIconRaw)(({
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    transition: '200ms',
    margin: '30px 0px',

    '&:hover': {
        scale: '1.05',
    },
}));

const Center = styled('div')(({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
}));

export default PlayTrackMenu;
