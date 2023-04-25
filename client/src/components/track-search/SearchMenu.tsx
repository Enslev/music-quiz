import React, { useEffect, useState } from 'react';
import { Box, Button, Slide, Slider, Stack, styled } from '@mui/material';
import RightMenu from '../RightMenu';
import TrackSearchBar from '../track-search/TrackSearchBar';
import { useActions, useAppState } from '../../overmind';
import { TrackFromSpotify } from '../../overmind/actions/api/types';
import TrackPreview from '../track-search/TrackPreview';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as StopIconRaw } from '../../assets/stop-circle.svg';
import { Track } from '../../overmind/actions/api/quiz';
import { pad } from '../../services/utils';

interface Props {
    open: boolean;
    track: Track;
    handleClose: (selectedTrack: TrackFromSpotify | null) => void;
}

const SearchMenu: React.FC<Props> = ({
    open,
    handleClose,
    track,
}) => {

    const { spotifyPlayer } = useAppState();
    const { search, play, stop, getTrack } = useActions().api.spotify;

    const [searchResult, setSearchResult] = useState<TrackFromSpotify[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<TrackFromSpotify | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [manualSearch, setManualSearch] = useState<boolean>(false);
    const [selectedTrackPosition, setSelectedTrackPosition] = useState<number>(track.position);

    const onSearch = async (searchValue: string) => {
        const searchResponse = await search(searchValue);
        if (!searchResponse) {
            setSearchResult([]);
            return;
        }

        setSearchResult(searchResponse?.tracks.items);
    };

    const fetchSelectedTrack = async (trackUri: string) => {
        const spotifyTrack = await getTrack(trackUri);
        setSelectedTrack(spotifyTrack);
        setLoading(false);
    };

    const handlePositionChange = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;

        track.position = newPosition;
        setSelectedTrackPosition(newPosition);
    };

    const formatMs = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms - (minutes * 60000)) / 1000);
        return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
    };

    const handlePlay = () => {
        if (!selectedTrack) return;

        play({
            trackUri: selectedTrack.uri,
            position: selectedTrackPosition,
        });
    };


    const handleCloseSearch = () => {
        setSelectedTrack(null);
        setSearchValue('');
        setManualSearch(false);
        handleClose(selectedTrack);
    };

    // If saved track is passed in, get it go directly to Selected Track view
    useEffect(() => {
        if (!loading && !manualSearch && !selectedTrack && track.trackUrl) {
            setLoading(true);
            fetchSelectedTrack(track.trackUrl);
        }
    });

    if (loading) {
        return <></>;
    }

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
                            <StopIcon onClick={() => stop()}/>
                        }
                    </Center>
                    <SliderWrapper>
                        <span>Start position</span>
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                            <span>{formatMs(selectedTrackPosition)}</span>
                            <Slider
                                value={selectedTrackPosition}
                                onChange={(e, newValue) => handlePositionChange(newValue)}
                                min={0}
                                max={selectedTrack.duration_ms}
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
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
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

const StopIcon = styled(StopIconRaw)(({
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
