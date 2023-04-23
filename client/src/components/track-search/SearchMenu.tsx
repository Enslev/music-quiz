import React, { useState } from 'react';
import { Button, Slide, styled } from '@mui/material';
import RightMenu from '../RightMenuComponent';
import TrackSearchBar from '../track-search/TrackSearchBar';
import { useActions } from '../../overmind';
import { TrackFromSpotify } from '../../overmind/actions/api/types';
import TrackPreview from '../track-search/TrackPreview';

interface Props {
    open: boolean,
    onClose: () => void;
}

const SearchMenu: React.FC<Props> = (props) => {

    const { open, onClose } = props;
    const { search } = useActions().api.spotify;

    const [searchResult, setSearchResult] = useState<TrackFromSpotify[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

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
        handleClose={onClose}
    >
        <div style={{ overflowX: 'hidden' }}>
            <Slide direction='left' in={Boolean(selectedTrack)}>
                <div>
                    <Button onClick={() => setSelectedTrack(null)}>Go back</Button>
                </div>
            </Slide>
            <Slide direction='right' in={Boolean(!selectedTrack)}>
                <div>
                    <TrackSearchBar
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

export default SearchMenu;
