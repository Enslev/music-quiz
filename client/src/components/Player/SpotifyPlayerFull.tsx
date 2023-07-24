import { Slide, Slider, Stack, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Track } from '../../overmind/effects/api/quizzes/types';
import { useActions, useAppState } from '../../overmind';
import { TextWithScroll } from './TextWithScroll';

import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { formatMs } from '../../services/utils';
import { useKeyboardShortcut } from '../../services/keyboard.service';

interface Props {
    hide?: boolean;
    disableKeybaord?: boolean;
    tracks: Track[];
}

export const SpotifyPlayerFull: React.FC<Props> = (props) => {

    const {
        tracks,
        hide = false,
        disableKeybaord = false,
    } = props;

    const { resume, pause, seek, updatePlaybackState } = useActions().spotify;
    const { currentlyPlaying, isPlaying, playpackPosition } = useAppState().spotifyPlayer;
    const [ currentTrack, setCurrentTrack ] = useState<Track | null>(null);
    const [ selectedTrackStartPosition, setSelectedTrackStartPosition ] = useState<number>(playpackPosition ?? 0);
    const [ sliderFocused, setSliderFocused ] = useState<boolean>(false);

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
            {currentTrack &&
            <Player>
                <div className='left'>

                    <Title text={currentTrack.title}/>
                    <Artist text={currentTrack.artist}/>
                </div>
                <div className='center'>
                    <Stack spacing={2} direction="row" style={{ width: '100%' }} alignItems="center">
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
                <div className='right'>
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
                </div>
            </Player>
            }
        </PlayerWrapper>
    </Slide>;
};

const PlayerWrapper = styled('div')(({
    position: 'fixed',
    bottom: '0px',
    width: '100vw',
}));

const Player = styled('div')(({ theme }) =>({
    color: 'white',
    display: 'flex',
    width: '100%',
    padding: '5px 10px',
    borderTop: '1px black solid',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.custom.darkerBackground,
    boxShadow: '0px 0px 15px -3px rgba(0,0,0,0.5)',
    transition: '300ms',

    '.left': {
        width: '33vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    '.center': {
        width: '34vw',
        display: 'flex',
    },
    '.right': {
        width: '33vw',
        display: 'flex',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5px',
}));

const PlayIcon = styled(PlayIconRaw)(({ theme }) => ({
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
        color : theme.palette.primary.main,
    },
}));

const PauseIcon = styled(PauseIconRaw)(({ theme }) => ({
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.05',
        color : theme.palette.primary.main,
    },
}));
