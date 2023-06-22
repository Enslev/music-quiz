import React, {  } from 'react';
import { styled } from '@mui/material';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as StopIconRaw } from '../../assets/stop-circle.svg';
import { useActions, useAppState } from '../../overmind';
import { SpotifyTrackObject } from '../../overmind/actions/api/spotify/types';

interface Props {
    spotifyTrack: SpotifyTrackObject;
    onSelect: (trackUri: SpotifyTrackObject) => void;
}

const TrackPreview: React.FC<Props> = ({
    spotifyTrack,
    onSelect,
}) => {

    const { spotifyPlayer } = useAppState();
    const { play, stop } = useActions().api.spotify;

    const handleStop = (e: React.MouseEvent) => {
        e.stopPropagation();
        stop();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        play({ trackUri: spotifyTrack.uri });
    };

    return <PreviewWrapper onClick={() => onSelect(spotifyTrack)}>
        <TrackWrapper>
            <img src={spotifyTrack.album.images[2].url}></img>
            <TrackDetails>
                <span>{spotifyTrack.name}</span>
                <span className='artist'>{spotifyTrack.artists.map((artist) => artist.name).join(', ')}</span>
            </TrackDetails>
        </TrackWrapper>

        { (!spotifyPlayer.isPlaying || spotifyPlayer.currentlyPlaying != spotifyTrack.uri) &&
            <PlayIcon onClick={handlePlay}/>
        }

        { (spotifyPlayer.isPlaying && spotifyPlayer.currentlyPlaying == spotifyTrack.uri) &&
            <StopIcon onClick={handleStop}/>
        }

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

const StopIcon = styled(StopIconRaw)(({
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
