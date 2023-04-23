import React, { useState } from 'react';
import { Quiz } from '../../overmind/actions/api/quiz';
import { ReactComponent as PlusIconRaw } from '../../assets/plus-circle.svg';
import { styled } from '@mui/material';
import RightMenu from '../RightMenuComponent';
import TrackSearchBar from '../track-search/TrackSearchBar';
import { useActions } from '../../overmind';
import { TrackFromSpotify } from '../../overmind/actions/api/types';
import TrackPreview from '../track-search/TrackPreview';

interface Props {
    isRevealed?: boolean,
    track: Quiz['categories'][number]['tracks'][number],
    editMode: boolean,
}

const JeopardyBox: React.FC<Props> = (props) => {

    const { track, isRevealed, editMode } = props;
    const { search } = useActions().api.spotify;

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<TrackFromSpotify[]>([]);

    const onSearch = async (searchValue: string) => {
        const searchResponse = await search(searchValue);
        if (!searchResponse) {
            setSearchResult([]);
            return;
        }

        setSearchResult(searchResponse?.tracks.items);
    };

    if (editMode) {
        return <>
            <BoxWrapperEditable
                className={'track-box'}
                onClick={() => setModalIsOpen(true)}
            >
                <PlusIcon/>
            </BoxWrapperEditable>

            <RightMenu
                open={modalIsOpen}
                handleClose={() => setModalIsOpen(false)}
            >
                <TrackSearchBar
                    onSearch={(value) => onSearch(value)}
                    onClear={() => setSearchResult([])}
                />
                <TrackWrapper>
                    {searchResult.map((track) => <TrackPreview key={track.id} spotifyTrack={track}/>)}
                </TrackWrapper>
            </RightMenu>
        </>;
    }


    return <BoxWrapperHidden
        className={'track-box' + (isRevealed ? '': ' hidden')}
    >
        {isRevealed && (<div>
            <span className='artist'>{track.artist}</span>
            <h3>{track.title}</h3>
        </div>)}
        {!isRevealed && (<div className='hidden-content'>
            <span className='points'>{track.points}</span>
        </div>)}
    </BoxWrapperHidden>;
};

const PlusIcon = styled(PlusIconRaw)`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

const BoxWrapperEditable = styled('div')`
    height: 120px;

    background-color: transparent;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align : center;
    cursor: pointer;
    transition: 500ms;

    &:hover {
        background-color: #2DC4B5;
    }

    &.hidden {
        background: rgb(50,102,112);
        background: linear-gradient(135deg, rgba(50,102,112,1) 0%, rgba(45,196,181,1) 100%);
    }

    .points {
        font-size: 30px;
    }

    .artist {
        font-size: 15px;
    }
`;


const BoxWrapperHidden = styled('div')`
    height: 120px;

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align : center;

    &.hidden {
        background: rgb(50,102,112);
        background: linear-gradient(135deg, rgba(50,102,112,1) 0%, rgba(45,196,181,1) 100%);
    }

    .points {
        font-size: 30px;
    }

    .artist {
        font-size: 15px;
    }
`;

const TrackWrapper = styled('div')`
    display: flex;
    height: 90%;
    flex-direction: column;
    overflow-y: scroll;
`;

export default JeopardyBox;
