import React, { useEffect, useState } from 'react';
import { styled, Slider, Stack, Slide } from '@mui/material';
import { useActions, useAppState } from '../../overmind';
import { Track } from '../../overmind/effects/api/quizzes/types';
import { TextWithScroll } from './TextWithScroll';
import { formatMs } from '../../services/utils';
import { useKeyboardShortcut } from '../../services/keyboard.service';

import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { ReactComponent as ChevronDownIconRaw } from '../../assets/chevron-down.svg';
import { ReactComponent as ChevronUpIconRaw } from '../../assets/chevron-up.svg';
import { ReactComponent as XIconRaw } from '../../assets/x.svg';

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
    const [ currentTrack, setCurrentTrack ] = useState<Track | null>(null);
    const [ selectedTrackStartPosition, setSelectedTrackStartPosition ] = useState<number>(playpackPosition ?? 0);
    const [ sliderFocused, setSliderFocused ] = useState<boolean>(false);
    const [ playerHovered, setPlayerHovered ] = useState<boolean>(false);
    const [ minimized, setMinimized ] = useState<boolean>(true);

    useKeyboardShortcut(' ', () => {
        if (disableKeybaord || !currentlyPlaying) return;
        isPlaying ? pause() : resume();
    });

    useEffect(() => {
        updatePlaybackState();
    }, []);

    useEffect(() => {
        if (!currentlyPlaying) return;

        const foundTrack = tracks.find((track) => track.trackUrl == currentlyPlaying);
        setCurrentTrack(foundTrack ?? null);
        setSelectedTrackStartPosition(foundTrack?.startPosition ?? 0);
    }, [ currentlyPlaying ]);

    useEffect(() => {
        if (sliderFocused) return;
        setSelectedTrackStartPosition(playpackPosition ?? 0);
    }, [ playpackPosition ]);

    const handlePositionChange = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        setSelectedTrackStartPosition(newPosition);
    };

    const handlePositionChangeCommit = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        seek(newPosition);
    };

    return <Slide
        direction='up'
        in={Boolean(currentlyPlaying) && !hide}
    >
        <PlayerWrapper>
            {currentTrack && <>
                <Player
                    onMouseEnter={() => setPlayerHovered(true)}
                    onMouseLeave={() => setPlayerHovered(false)}
                    className={minimized && !playerHovered ? 'minimized' : ''}
                >
                    <div>
                        <Title text={currentTrack.title}/>
                        <Artist text={currentTrack.artist}/>

                        <ButtonsWrapper>
                            {isPlaying ?
                                <PauseIcon onClick={() => {
                                    pause();
                                }}/> :
                                <PlayIcon onClick={() => {
                                    resume();
                                }}/>
                            }
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
                    </div>
                    <TopRow className={playerHovered || !minimized ? 'show' : ''}>
                        <XIcon onClick={() => {
                            stop();
                        }}/>
                        {minimized && <ChevronUpIcon onClick={() => setMinimized(false)}/>}
                        {!minimized && <ChevronDownIcon onClick={() => setMinimized(true)}/>}
                    </TopRow>
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
    borderRadius: '15px 15px 0px 0px',
    padding: '5px 10px',
    border: '1px black solid',
    borderBottom: '0px',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.custom.darkerBackground,
    display: 'flex',
    flexDirection: 'column-reverse',
    boxShadow: '0px 0px 15px -3px rgba(0,0,0,0.5)',
    transition: '300ms',

    '&.minimized': {
        transform: 'translateY(95px)',
    },
}));

const TopRow = styled('div')(({
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row-reverse',
    overflow: 'hidden',
    height: '0',
    transition: '200ms',

    '&.show': {
        height: '15px',
    },

    '>*': {
        marginLeft: '5px',
    },
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

const PlayIcon = styled(PlayIconRaw)(({ theme }) => ({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
        color : theme.palette.primary.main,
    },
}));

const PauseIcon = styled(PauseIconRaw)(({ theme }) => ({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
        color : theme.palette.primary.main,
    },
}));

const ChevronDownIcon = styled(ChevronDownIconRaw)(({ theme }) => ({
    width: '15px',
    height: '15px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
        color : theme.palette.primary.main,
    },
}));

const ChevronUpIcon = styled(ChevronUpIconRaw)(({ theme }) => ({
    width: '15px',
    height: '15px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
        color : theme.palette.primary.main,
    },
}));

const XIcon = styled(XIconRaw)(({ theme }) => ({
    width: '15px',
    height: '15px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
        color : theme.palette.primary.main,
    },
}));
