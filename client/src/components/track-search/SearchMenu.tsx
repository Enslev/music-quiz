import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Slide, Slider, Stack, styled } from '@mui/material';
import { RightMenu } from '../RightMenu';
import TrackSearchBar, { TrackSearchBarRefHandler } from '../track-search/TrackSearchBar';
import { useActions, useAppState } from '../../overmind';
import TrackPreview from '../track-search/TrackPreview';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { Track } from '../../overmind/effects/api/quizzes/types';
import { formatMs } from '../../services/utils';
import { SpotifyTrackObject } from '../../overmind/effects/api/spotify/types';

export type SelectedTrackMeta = {
    startPosition?: number,
    highlightLocation?: number,
}

interface Props {
    open: boolean;
    track: Track;
    handleClose: (selectedTrack: SpotifyTrackObject | null, meta: SelectedTrackMeta) => void;
}

const SearchMenu: React.FC<Props> = ({
    open,
    handleClose,
    track,
}) => {

    const { spotifyPlayer } = useAppState();
    const { spotify } = useActions();

    const [ searchResult, setSearchResult ] = useState<SpotifyTrackObject[]>([]);
    const [ selectedTrack, setSelectedTrack ] = useState<SpotifyTrackObject | null>(null);
    const [ searchValue, setSearchValue ] = useState<string>('');
    const [ manualSearch, setManualSearch ] = useState<boolean>(false);
    const [ openOverride, setOpenOverride ] = useState<boolean>(true);
    const [ selectedTrackStartPosition, setSelectedTrackStartPosition ] = useState<number>(track.startPosition);

    const [ selectedTrackMeta, setSelectedTrackMeta ] = useState<Required<SelectedTrackMeta>>({
        startPosition: track.startPosition,
        highlightLocation: 0,
    });

    const searchBarRef = useRef<TrackSearchBarRefHandler>(null);

    useEffect(() => {
        console.log(openOverride);
        if (open) {
            searchBarRef.current?.focusSearch();
        }
    }, [ open ]);

    const onSearch = async (searchValue: string) => {
        const searchResponse = await spotify.search(searchValue);
        if (!searchResponse) {
            setSearchResult([]);
            return;
        }

        setSearchResult(searchResponse?.tracks.items);
    };

    const fetchSelectedTrack = async (trackUri: string) => {
        const spotifyTrack = await spotify.getTrack(trackUri);
        setSelectedTrack(spotifyTrack);
    };

    const handlePositionChange = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        setSelectedTrackStartPosition(newPosition);
    };

    const handlePositionChangeCommit = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        spotify.seek(newPosition);
    };

    const handlePlay = () => {
        if (!selectedTrack) return;

        spotify.play({
            trackUri: selectedTrack.uri,
            position: selectedTrackStartPosition,
        });
    };

    const handleCloseSearch = () => {
        setSelectedTrack(null);
        setSearchValue('');
        setManualSearch(false);
        spotify.stop();

        handleClose(selectedTrack, selectedTrackMeta);
    };

    // If saved track is passed in, get it go directly to Selected Track view
    useEffect(() => {
        if (!open) return;
        if (!manualSearch && !selectedTrack && track.trackUrl) {
            setOpenOverride(false);
            fetchSelectedTrack(track.trackUrl).then(async () => {
                await new Promise((resolve) => setTimeout(resolve, 100));
                setOpenOverride(true);
            });
        }
    }, [ open ]);

    useEffect(() => {
        if (spotifyPlayer.playpackPosition == null) return;
        if (spotifyPlayer.currentlyPlaying != selectedTrack?.uri) {
            setSelectedTrackStartPosition(0);
            return;
        }

        setSelectedTrackStartPosition(spotifyPlayer.playpackPosition);
    }, [ spotifyPlayer.playpackPosition ]);

    return <RightMenu
        open={open && openOverride}
        onClose={handleCloseSearch}
    >
        <>
            {selectedTrack &&
            <Slide direction='left' in={Boolean(selectedTrack)}>
                <TrackSelectedWrapper>
                    <Button onClick={() => {
                        setSelectedTrack(null);
                        setManualSearch(true);
                    }}>Go back</Button>
                    <span className='title'>{selectedTrack?.name}</span>
                    <span className='artist'>
                        {selectedTrack.artists.map((artist) => artist.name).join(', ')}
                    </span>
                    <Center>

                        { (!spotifyPlayer.isPlaying || spotifyPlayer.currentlyPlaying != selectedTrack.uri) &&
                            <PlayIcon onClick={handlePlay}/>
                        }

                        { spotifyPlayer.isPlaying && spotifyPlayer.currentlyPlaying == selectedTrack.uri &&
                            <PauseIcon onClick={() => spotify.pause()}/>
                        }
                    </Center>
                    <SliderWrapper>
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                            <span>{formatMs(selectedTrackStartPosition)}</span>
                            <Slider
                                value={selectedTrackStartPosition}
                                min={0}
                                max={selectedTrack.duration_ms}
                                onChange={(_, newValue) => handlePositionChange(newValue)}
                                onChangeCommitted={(_, newValue) => handlePositionChangeCommit(newValue)}
                                disabled={Boolean(spotifyPlayer.currentlyPlaying) && spotifyPlayer.currentlyPlaying != selectedTrack?.uri}
                            />
                            <span>{formatMs(selectedTrack.duration_ms)}</span>
                        </Stack>
                    </SliderWrapper>
                    <Button
                        variant="contained"
                        onClick={() => setSelectedTrackMeta({
                            ...selectedTrackMeta,
                            startPosition: selectedTrackStartPosition,
                        })}
                    >
                        Set as start location
                    </Button>
                    Current start position: {formatMs(selectedTrackMeta.startPosition)}
                </TrackSelectedWrapper>
            </Slide>}

            {!selectedTrack &&
            <Slide direction='right' in={Boolean(!selectedTrack)}>
                <div>
                    <TrackSearchBar
                        value={searchValue}
                        onChange={(newValue) => setSearchValue(newValue)}
                        onSearch={(value) => onSearch(value)}
                        onClear={() => setSearchResult([])}
                        ref={searchBarRef}
                    />
                    <TrackWrapper>
                        {searchResult.map((track) => <TrackPreview
                            key={track.id}
                            spotifyTrack={track}
                            onSelect={(trackUri) => setSelectedTrack(trackUri)}
                        />)}
                    </TrackWrapper>
                </div>
            </Slide>}
        </>
    </RightMenu>;

};

const TrackWrapper = styled('div')(({
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    paddingRight: '5px',
}));

const TrackSelectedWrapper = styled('div')(({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

    '.title': {
        fontWeight: 600,
        fontSize: '30px',
    },

    '.artist': {
        fontSize: '20px',
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

export default SearchMenu;
