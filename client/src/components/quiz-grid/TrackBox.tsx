
import React, { useState } from 'react';
import SearchMenu from '../track-search/SearchMenu';
import { Track } from '../../overmind/actions/api/quiz';
import { SpotifyTrackObject } from '../../overmind/actions/api/types';
import { styled } from '@mui/material';

import { ReactComponent as PlusIconRaw } from '../../assets/plus-circle.svg';

interface Props {
    track: Track;
    editMode: boolean;
    revealed: boolean;
    saveTrigger: () => void;
}

const TrackBox: React.FC<Props> = ({
    track,
    editMode,
    revealed,
    saveTrigger,
}) => {

    const [searchMenuIsOpen, setSearchMenuIsOpen] = useState<boolean>(false);


    const handleClose = (selectedTrack: SpotifyTrackObject | null) => {
        setSearchMenuIsOpen(false);
        if (!selectedTrack) {
            track.title = '';
            track.artist = '';
            track.trackUrl = '';
            track.startPosition = 0;
            saveTrigger();
            return;
        }

        track.title = selectedTrack.name;
        track.artist = selectedTrack.artists.map((artist) => artist.name).join(', ');
        track.trackUrl = selectedTrack.uri;
        saveTrigger();
    };


    if (editMode) {
        return (<>
            {track.trackUrl &&
                <BoxWrapperEditable
                    className={'track-box'}
                    onClick={() => setSearchMenuIsOpen(true)}
                >
                    <span className='artist'>{track.artist}</span>
                    <span className='title'>{track.title}</span>
                </BoxWrapperEditable>
            }
            {!track.trackUrl &&
                <BoxWrapperEditable
                    className={'track-box'}
                    onClick={() => setSearchMenuIsOpen(true)}
                >
                    <PlusIcon/>
                </BoxWrapperEditable>
            }

            <SearchMenu
                open={searchMenuIsOpen}
                handleClose={handleClose}
                track={track}
            />
        </>);
    }


    return (
        <BoxWrapper
            className={'track-box' + (revealed ? '': ' hidden')}
        >
            {revealed && (<>
                <span className='title'>{track.title}</span>
                <span className='artist'>{track.artist}</span>
            </>)}
            {!revealed && (<div className='hidden-content'>
                <span className='points'>{track.points}</span>
            </div>)}
        </BoxWrapper>
    );
};

const BoxWrapperEditable = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    transition: '500ms',
    overflow: 'hidden',

    '&:hover': {
        backgroundColor: theme.palette.primary.main,
    },

    '.points': {
        fontSize: '10px',
    },

    '.artist': {
        fontSize: '15px',
    },

    '.title': {
        fontSize: '20px',
    },
}));

const BoxWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    overflow: 'hidden',

    '&.hidden': {
        background:  `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.main}  100%)`,
    },

    '.points': {
        fontSize: '30px',
    },

    '.artist': {
        fontSize: '15px',
    },

    '.title': {
        fontSize: '25px',
    },

}));

const PlusIcon = styled(PlusIconRaw)`
    width: 30px;
    height: 30px;
`;

export default TrackBox;
