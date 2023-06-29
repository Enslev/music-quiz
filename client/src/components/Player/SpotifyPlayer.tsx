import React, { useEffect, useState } from 'react';
import { styled, Slider, Stack, Slide } from '@mui/material';
import { useActions, useAppState } from '../../overmind';
import { Track } from '../../overmind/effects/api/quizzes/types';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { ReactComponent as StopIconRaw } from '../../assets/stop-circle.svg';
import { formatMs } from '../../services/utils';
import { TextWithScroll } from './TextWithScroll';
import { useThrottledCallback } from 'use-debounce';

interface Props {
    hide?: boolean;
    disableKeybaord?: boolean;
    tracks: Track[];
}

export const SpotifyPlayer: React.FC<Props> = (props) => {

    const {
        tracks,
        hide = false,
        disableKeybaord = false,
    } = props;

    const { resume, pause, stop, seek, updatePlaybackState } = useActions().spotify;
    const { currentlyPlaying, isPlaying, playpackPosition } = useAppState().spotifyPlayer;
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [selectedTrackStartPosition, setSelectedTrackStartPosition] = useState<number>(playpackPosition ?? 0);
    const [sliderFocused, setSliderFocused] = useState<boolean>(false);

    let keyDownAllowed = true;

    useEffect(() => {
        updatePlaybackState();
    }, []);

    useEffect(() => {
        if (currentlyPlaying) {
            document.addEventListener('keydown', keyDownHandler);
            document.addEventListener('keyup', keyUpHandler);
        } else {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        }

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, [currentlyPlaying]);

    useEffect(() => {
        if (!currentlyPlaying) return;
        const foundTrack = tracks.find((track) => track.trackUrl == currentlyPlaying);
        setCurrentTrack(foundTrack ?? null);
        setSelectedTrackStartPosition(foundTrack?.startPosition ?? 0);
    }, [currentlyPlaying, tracks]);

    useEffect(() => {
        if (sliderFocused) return;
        setSelectedTrackStartPosition(playpackPosition ?? 0);
    }, [playpackPosition]);

    const handlePositionChange = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        setSelectedTrackStartPosition(newPosition);
    };

    const handlePositionChangeCommit = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        seek(newPosition);
    };

    const keyDownHandler = (event: KeyboardEvent) => {
        if (!keyDownAllowed) return;

        if (event.key == ' ') {
            keyDownAllowed = false;
            handleSpaceDown();
        }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key == ' ') {
            keyDownAllowed = true;
        }
    };

    const handleSpaceDown = useThrottledCallback(() => {
        if (disableKeybaord) return;

        isPlaying ? pause() : resume();
    }, 200, { leading: true, trailing: false });

    return <Slide
        direction='up'
        in={Boolean(currentlyPlaying) && !hide}
    >
        <PlayerWrapper>
            {currentTrack && <>
                <Player>
                    <Artist text={currentTrack.artist}/>

                    <Title text={currentTrack.title}/>

                    <ButtonsWrapper>
                        {isPlaying ?
                            <PauseIcon onClick={() => {
                                pause();
                            }}/> :
                            <PlayIcon onClick={() => {
                                resume();
                            }}/>
                        }
                        <StopIcon onClick={() => {
                            stop();
                        }}/>
                    </ButtonsWrapper>
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <span>{formatMs(selectedTrackStartPosition ?? 0)}</span>
                        <Slider
                            value={selectedTrackStartPosition ?? 0}
                            min={0}
                            max={currentTrack.length}
                            onChange={(e, newValue) => handlePositionChange(newValue)}
                            onChangeCommitted={(e, newValue) => handlePositionChangeCommit(newValue)}
                            onMouseDown={() => setSliderFocused(true)}
                            onMouseUp={() => setSliderFocused(false)}
                        />
                        <span>{formatMs(currentTrack.length)}</span>
                    </Stack>
                </Player>
            </>}
        </PlayerWrapper>
    </Slide>;
};

const PlayerWrapper = styled('div')(({
    position: 'fixed',
    bottom: '0px',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
}));

const Player = styled('div')(({ theme }) =>({
    color: 'white',
    width: '400px',
    height: '140px',
    borderRadius: '15px 15px 0px 0px',
    padding: '5px 10px',
    border: '1px black solid',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.custom.darkerBackground,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 0px 15px -3px rgba(0,0,0,0.5)',
}));

const Artist = styled(TextWithScroll)(({
    fontSize: '12px',
    color: 'grey',
}));

const Title = styled(TextWithScroll)(({
    fontSize: '20px',
}));

const ButtonsWrapper = styled('div')(({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5px',
}));

const PlayIcon = styled(PlayIconRaw)(({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
    },
}));

const PauseIcon = styled(PauseIconRaw)(({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
    },
}));

const StopIcon = styled(StopIconRaw)(({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
    },
}));
