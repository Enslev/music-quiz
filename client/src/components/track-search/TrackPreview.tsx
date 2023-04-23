import React, {  } from 'react';
import { styled } from '@mui/material';
import { TrackFromSpotify } from '../../overmind/actions/api/types';
import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { useActions, useAppState } from '../../overmind';

interface Props {
    spotifyTrack: TrackFromSpotify;
}

const TrackPreview: React.FC<Props> = (props) => {
    const { spotifyTrack } = props;
    const { spotifyPlayer } = useAppState();
    const { play, pause } = useActions().api.spotify;

    return <PreviewWrapper>
        <TrackWrapper>
            <img src={spotifyTrack.album.images[2].url}></img>
            <TrackDetails>
                <span>{spotifyTrack.name}</span>
                <span className='artist'>{spotifyTrack.artists.map((artist) => artist.name).join(', ')}</span>
            </TrackDetails>
        </TrackWrapper>
        { spotifyPlayer.currentlyPlaying == spotifyTrack.uri && <PauseIcon onClick={() => pause()}/>}
        { spotifyPlayer.currentlyPlaying != spotifyTrack.uri && <PlayIcon onClick={() => play(spotifyTrack.uri)}/>}
    </PreviewWrapper>;
};

const PreviewWrapper = styled('div')`
    display: flex;
    align-items: center;
    margin-top: 20px;
    width: 100%;
    font-size: 20px;
    justify-content: space-between;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;

    &:hover {
        background: linear-gradient(135deg, rgba(50,102,112,1) 0%, rgba(45,196,181,1) 100%);
    }
`;

const TrackWrapper = styled('div')`
    display: flex;
    max-width: 90%;
`;

const TrackDetails = styled('div')`
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .artist {
        font-size: 15px;
        color: lightGray;
    }
`;

const PlayIcon = styled(PlayIconRaw)`
    width: 30px;
    height: 30px;
    margin: 0px 5px;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        scale: 1.2;
    }
`;

const PauseIcon = styled(PauseIconRaw)`
    width: 30px;
    height: 30px;
    margin: 0px 5px;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        scale: 1.2;
    }
`;

export default TrackPreview;
