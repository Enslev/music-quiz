import React, { useState } from 'react';
import { Button, Slide, styled } from '@mui/material';
import RightMenu from '../RightMenuComponent';
import TrackSearchBar from '../track-search/TrackSearchBar';
import { useActions, useAppState } from '../../overmind';
import { TrackFromSpotify } from '../../overmind/actions/api/types';
import TrackPreview from '../track-search/TrackPreview';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';

interface Props {
    open: boolean,
    handleClose: (selectedTrack: TrackFromSpotify | null) => void;
}

const SearchMenu: React.FC<Props> = (props) => {

    const { open, handleClose } = props;
    const { spotifyPlayer } = useAppState();
    const { search, play, pause } = useActions().api.spotify;

    const [searchResult, setSearchResult] = useState<TrackFromSpotify[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<TrackFromSpotify | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');

    const onSearch = async (searchValue: string) => {
        const searchResponse = await search(searchValue);
        if (!searchResponse) {
            setSearchResult([]);
            return;
        }

        setSearchResult(searchResponse?.tracks.items);
    };

    return <RightMenu
        open={open}
        handleClose={() => {
            setSelectedTrack(null);
            setSearchValue('');
            handleClose(selectedTrack);
        }}
    >
        <div style={{ overflowX: 'hidden' }}>
            {selectedTrack &&
            <Slide direction='left' in={Boolean(selectedTrack)}>
                <SelectedTrackWrapper>
                    <Button onClick={() => setSelectedTrack(null)}>Go back</Button>
                    <span className='title'>{selectedTrack?.name}</span>
                    <span className='artist'>
                        {selectedTrack.artists.map((artist) => artist.name).join(', ')}
                    </span>
                    <Center>
                        { spotifyPlayer.currentlyPlaying == selectedTrack.uri && <PauseIcon onClick={() => pause()}/>}
                        { spotifyPlayer.currentlyPlaying != selectedTrack.uri && <PlayIcon onClick={() => play(selectedTrack.uri)}/>}
                    </Center>
                </SelectedTrackWrapper>
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

const TrackWrapper = styled('div')`
    display: flex;
    height: 90%;
    flex-direction: column;
    overflow-y: scroll;
`;

const SelectedTrackWrapper = styled('div')`
    display: flex;
    align-items: flex-start;
    flex-direction: column;

    .title {
        font-weight: 600;
        font-size: 30px;
    }

    .artist {
        font-size: 20px;
    }
`;

const Center = styled('div')`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const PlayIcon = styled(PlayIconRaw)`
    width: 150px;
    height: 150px;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        scale: 1.05;
    }
`;

const PauseIcon = styled(PauseIconRaw)`
    width: 150px;
    height: 150px;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        scale: 1.05;
    }
`;

export default SearchMenu;
