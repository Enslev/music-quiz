import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Slide, Slider, Stack, styled } from '@mui/material';
import RightMenu from '../RightMenu';
import TrackSearchBar, { TrackSearchBarRefHandler } from '../track-search/TrackSearchBar';
import { useActions, useAppState } from '../../overmind';
import { SpotifyTrackObject } from '../../overmind/actions/api/types';
import TrackPreview from '../track-search/TrackPreview';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { Track } from '../../overmind/actions/api/quiz';
import { pad } from '../../services/utils';

interface Props {
    open: boolean;
    track: Track;
    handleClose: (selectedTrack: SpotifyTrackObject | null) => void;
}

const SearchMenu: React.FC<Props> = ({
    open,
    handleClose,
    track,
}) => {

    const { spotifyPlayer } = useAppState();
    const { spotify } = useActions().api;

    const [searchResult, setSearchResult] = useState<SpotifyTrackObject[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<SpotifyTrackObject | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [manualSearch, setManualSearch] = useState<boolean>(false);
    const [selectedTrackPosition, setSelectedTrackPosition] = useState<number>(track.startPosition);
    const searchBarRef = useRef<TrackSearchBarRefHandler>(null);

    useEffect(() => {
        if (open) {
            searchBarRef.current?.focusSearch();
        }
    }, [open]);

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
        setSelectedTrackPosition(newPosition);
    };

    const handlePositionChangeCommit = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        spotify.seek(newPosition);
    };

    const formatMs = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms - (minutes * 60000)) / 1000);
        return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
    };

    const handlePlay = () => {
        if (!selectedTrack) return;

        spotify.play({
            trackUri: selectedTrack.uri,
            position: selectedTrackPosition,
        });
    };


    const handleCloseSearch = () => {
        setSelectedTrack(null);
        setSearchValue('');
        setManualSearch(false);
        spotify.stop();
        handleClose(selectedTrack);
    };

    // If saved track is passed in, get it go directly to Selected Track view
    useEffect(() => {
        if (!manualSearch && !selectedTrack && track.trackUrl) {
            fetchSelectedTrack(track.trackUrl);
        }
    });

    useEffect(() => {
        if (spotifyPlayer.playpackPosition == null || spotifyPlayer.currentlyPlaying != selectedTrack?.uri) return;
        setSelectedTrackPosition(spotifyPlayer.playpackPosition);
    }, [spotifyPlayer.playpackPosition]);

    return <RightMenu
        open={open}
        handleClose={handleCloseSearch}
    >
        <div style={{ overflowX: 'hidden' }}>
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

                        { !spotifyPlayer.isPlaying &&
                            <PlayIcon onClick={handlePlay}/>
                        }

                        { spotifyPlayer.isPlaying && spotifyPlayer.currentlyPlaying == selectedTrack.uri &&
                            <PauseIcon onClick={() => spotify.pause()}/>
                        }
                    </Center>
                    <SliderWrapper>
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                            <span>{formatMs(selectedTrackPosition)}</span>
                            <Slider
                                value={selectedTrackPosition}
                                min={0}
                                max={selectedTrack.duration_ms}
                                onChange={(e, newValue) => handlePositionChange(newValue)}
                                onChangeCommitted={(e, newValue) => handlePositionChangeCommit(newValue)}
                                disabled={Boolean(spotifyPlayer.isPlaying)}
                            />
                            <span>{formatMs(selectedTrack.duration_ms)}</span>
                        </Stack>
                    </SliderWrapper>
                </TrackSelectedWrapper>
            </Slide>}
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
            </Slide>
        </div>
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
