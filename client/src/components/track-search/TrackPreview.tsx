import React, {  } from 'react';
import { styled } from '@mui/material';
import { TrackFromSpotify } from '../../overmind/actions/api/types';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { useActions, useAppState } from '../../overmind';

interface Props {
    spotifyTrack: TrackFromSpotify;
    onSelect: (trackUri: TrackFromSpotify) => void;
}

const TrackPreview: React.FC<Props> = ({
    spotifyTrack,
    onSelect,
}) => {

    const { spotifyPlayer } = useAppState();
    const { play, pause } = useActions().api.spotify;

    const handlePause = (e: React.MouseEvent) => {
        e.stopPropagation();
        pause();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        play(spotifyTrack.uri);
    };

    return <PreviewWrapper onClick={() => onSelect(spotifyTrack)}>
        <TrackWrapper>
            <img src={spotifyTrack.album.images[2].url}></img>
            <TrackDetails>
                <span>{spotifyTrack.name}</span>
                <span className='artist'>{spotifyTrack.artists.map((artist) => artist.name).join(', ')}</span>
            </TrackDetails>
        </TrackWrapper>
        { spotifyPlayer.currentlyPlaying == spotifyTrack.uri && <PauseIcon onClick={handlePause}/>}
        { spotifyPlayer.currentlyPlaying != spotifyTrack.uri && <PlayIcon onClick={handlePlay}/>}
    </PreviewWrapper>;
};

const PreviewWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
    width: '100%',
    fontSize: '20px',
    justifyContent: 'space-between',
    borderTopRightRadius: '25px',
    borderBottomRightRadius: '25px',
    cursor: 'pointer',

    '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.background.default} 25%, ${theme.palette.primary.main}  100%)`,
    },
}));

const TrackWrapper = styled('div')(({
    display: 'flex',
    maxWidth: '90%',
}));

const TrackDetails = styled('div')(({
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '10px',
    justifyContent: 'center',

    artist: {
        fontSize: '15px',
        color: 'lightGray',
    },
}));

const PlayIcon = styled(PlayIconRaw)(({
    width: '30px',
    height: '30px',
    margin: '0px 10px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.2',
    },
}));

const PauseIcon = styled(PauseIconRaw)(({
    width: '30px',
    height: '30px',
    margin: '0px 10px',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: '1.2',
    },
}));

export default TrackPreview;
