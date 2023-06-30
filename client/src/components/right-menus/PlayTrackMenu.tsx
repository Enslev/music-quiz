import React, { useEffect, useState } from 'react';
import { RightMenu } from '../RightMenu';
import { Category, Track } from '../../overmind/effects/api/quizzes/types';
import { Box, Slider, Stack, styled } from '@mui/material';
import { useAppState, useActions } from '../../overmind';

import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { formatMs } from '../../services/utils';

interface Props {
    category?: Category,
    track?: Track,
    open: boolean,
    onClose: () => void;
}

export const PlayTrackMenu: React.FC<Props> = (props) => {

    const {
        category,
        track,
        open,
        onClose,
    } = props;

    const { spotifyPlayer } = useAppState();
    const { play, pause, seek } = useActions().spotify;

    const [currentTrackPosition, setCurrentTrackPosition] = useState<number>(track?.startPosition ?? 0);
    const [sliderFocused, setSliderFocused] = useState<boolean>(false);

    useEffect(() => {
        if (!open) return;

        setCurrentTrackPosition(track?.startPosition ?? 0);
    }, [open]);

    useEffect(() => {
        if (spotifyPlayer.currentlyPlaying != track?.trackUrl) return;
        if (sliderFocused) return;

        setCurrentTrackPosition(spotifyPlayer.playpackPosition ?? 0);
    }, [spotifyPlayer.playpackPosition, sliderFocused, track]);

    if (!category || !track) return <></>;

    const handleStop = (e: React.MouseEvent) => {
        e.stopPropagation();
        pause();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        play({ trackUri: track.trackUrl, position: track.startPosition });
    };

    const handlePositionChange = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        setCurrentTrackPosition(newPosition);
    };

    const handlePositionChangeCommit = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        await seek(newPosition);
        setSliderFocused(false);
    };

    return (
        <RightMenu
            open={open}
            onClose={onClose}
        >
            <>
                <div className='header'>
                    <span>{category.title} - {track.points} </span>
                </div>
                <div className='content'>
                    <Title className='title'>{track.title + ''}</Title>
                    <Artist className='artist'>{track.artist}</Artist>

                    <Center>
                        { (!spotifyPlayer.isPlaying || spotifyPlayer.currentlyPlaying != track.trackUrl) &&
                            <PlayIcon onClick={handlePlay}/>
                        }

                        { (spotifyPlayer.isPlaying && spotifyPlayer.currentlyPlaying == track.trackUrl) &&
                            <PauseIcon onClick={handleStop}/>
                        }
                    </Center>
                    <SliderWrapper>
                        <Stack
                            spacing={2}
                            direction="row"
                            sx={{ mb: 1 }}
                            alignItems="center"
                        >
                            <span>{formatMs(currentTrackPosition)}</span>
                            <Slider
                                value={currentTrackPosition}
                                min={0}
                                max={track.length}
                                onChange={(e, newValue) => handlePositionChange(newValue)}
                                onChangeCommitted={(e, newValue) => handlePositionChangeCommit(newValue)}
                                onMouseDown={() => setSliderFocused(true)}
                                onMouseUp={() => setSliderFocused(false)}
                            />
                            <span>{formatMs(track.length)}</span>
                        </Stack>
                    </SliderWrapper>
                </div>
            </>

        </RightMenu>
    );
};

const Artist = styled('div')(({
    fontSize: '20px',
}));

const Title = styled('div')(({
    fontSize: '30px',
    fontWeight: '600',
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

const SliderWrapper = styled(Box)(({
    width: '100%',
    marginBottom: '10px',
}));


const Center = styled('div')(({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
}));
