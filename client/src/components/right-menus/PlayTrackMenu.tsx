import React, { useEffect, useState } from 'react';
import { RightMenu, RightMenuContent, RightMenuFooter, RightMenuHeader } from '../RightMenu';
import { Category, Track } from '../../overmind/effects/api/quizzes/types';
import { Box, Button, Checkbox, FormControlLabel, Slider, Stack, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import { useAppState, useActions } from '../../overmind';
import { formatMs } from '../../services/utils';
import { Claimed, Team } from '../../overmind/effects/api/sessions/types';
import { SessionAction } from '../../services/socket.service';

import { ReactComponent as PlayIconRaw } from '../../assets/play-circle.svg';
import { ReactComponent as PauseIconRaw } from '../../assets/pause-circle.svg';
import { ReactComponent as MonitorIconRaw } from '../../assets/monitor.svg';

interface Props {
    category?: Category,
    track?: Track,
    teams: Team[],
    open: boolean,
    previousClaimed: Claimed | null;
    challengeIsOpen: boolean,
    emitToSession: (action: SessionAction) => void,
    onClose: () => void;
    onWinner: (team: Team, track: Track, artistGuessed: boolean) => void;
}

export const PlayTrackMenu: React.FC<Props> = (props) => {

    const {
        category,
        track,
        teams,
        open,
        previousClaimed,
        challengeIsOpen,
        onClose,
        onWinner,
        emitToSession,
    } = props;

    const { spotifyPlayer } = useAppState();
    const { play, pause, seek } = useActions().spotify;

    const [currentTrackPosition, setCurrentTrackPosition] = useState<number>(track?.startPosition ?? 0);
    const [artistGuessed, setArtistGuessed] = useState<boolean>(false);
    const [sliderFocused, setSliderFocused] = useState<boolean>(false);
    const [winningTeamId, setWinningTeamId] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        setArtistGuessed(previousClaimed?.artistGuessed ?? false);
        setCurrentTrackPosition(track?.startPosition ?? 0);
        setWinningTeamId(previousClaimed?.teamId || null);
    }, [open]);

    useEffect(() => {
        if (spotifyPlayer.currentlyPlaying != track?.trackUrl) return;
        if (sliderFocused) return;

        setCurrentTrackPosition(spotifyPlayer.playpackPosition ?? 0);
    }, [spotifyPlayer.playpackPosition, sliderFocused, track]);

    if (!category || !track) return <></>;

    const handleStop = (e: React.MouseEvent) => {
        e.stopPropagation();
        pause();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        play({ trackUri: track.trackUrl, position: track.startPosition });
    };

    const handlePositionChange = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        setCurrentTrackPosition(newPosition);
    };

    const handlePositionChangeCommit = async (newPosition: number | number[]) => {
        if (Array.isArray(newPosition)) return;
        await seek(newPosition);
        setSliderFocused(false);
    };

    return (
        <RightMenu
            open={open}
            onClose={onClose}
        >
            <>
                <RightMenuHeader>
                    <span>{category.title} - {track.points} </span>
                </RightMenuHeader>
                <RightMenuContent>
                    <Title className='title'>{track.title + ''}</Title>
                    <Artist className='artist'>{track.artist}</Artist>

                    <Center>
                        { (!spotifyPlayer.isPlaying || spotifyPlayer.currentlyPlaying != track.trackUrl) &&
                            <PlayIcon onClick={handlePlay}/>
                        }

                        { (spotifyPlayer.isPlaying && spotifyPlayer.currentlyPlaying == track.trackUrl) &&
                            <PauseIcon onClick={handleStop}/>
                        }
                    </Center>
                    <SliderWrapper>
                        <Stack
                            spacing={2}
                            direction="row"
                            sx={{ mb: 1 }}
                            alignItems="center"
                        >
                            <span>{formatMs(currentTrackPosition)}</span>
                            <Slider
                                value={currentTrackPosition}
                                min={0}
                                max={track.length}
                                onChange={(e, newValue) => handlePositionChange(newValue)}
                                onChangeCommitted={(e, newValue) => handlePositionChangeCommit(newValue)}
                                onMouseDown={() => setSliderFocused(true)}
                                onMouseUp={() => setSliderFocused(false)}
                            />
                            <span>{formatMs(track.length)}</span>
                        </Stack>
                    </SliderWrapper>

                    <ActionWrapper>
                        {challengeIsOpen && <MonitorRedIcon
                            onClick={() => emitToSession({
                                type: 'challengeAction',
                                show: false,
                            })}
                        />}
                        {!challengeIsOpen && <MonitorIcon
                            onClick={() => emitToSession({
                                type: 'challengeAction',
                                show: true,
                                category: category.title,
                                points: track.points,
                            })}
                        />}
                    </ActionWrapper>
                </RightMenuContent>

                <RightMenuFooter>
                    <FormControlLabel
                        label="Artist guessed"
                        disabled={Boolean(previousClaimed?.teamId)}
                        control={<Checkbox
                            checked={artistGuessed}
                            onChange={() => setArtistGuessed(!artistGuessed)}
                        />}
                    />

                    <ToggleButtonGroup
                        orientation="vertical"
                        value={winningTeamId}
                        exclusive
                        fullWidth
                        disabled={Boolean(previousClaimed?.teamId)}
                        onChange={(event: React.MouseEvent<HTMLElement>, teamId: string) => {
                            setWinningTeamId(teamId);
                        }}
                        style={{ marginBottom: '10px' }}
                    >
                        {teams.map((team) =>
                            <ToggleButton
                                key={team._id}
                                value={team._id}
                                aria-label={team.name}
                                color='primary'
                                fullWidth
                            >
                                {team.name}
                            </ToggleButton>,
                        )}
                    </ToggleButtonGroup>

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={Boolean(previousClaimed?.teamId)}
                        onClick={() => {
                            const winningTeam = teams.find((team) => team._id == winningTeamId);
                            if (!winningTeam) return;
                            onWinner(winningTeam, track, artistGuessed);
                        }}
                    >
                        {previousClaimed ? 'Winner already selected' : 'This is the winner!'}
                    </Button>
                </RightMenuFooter>
            </>

        </RightMenu>
    );
};

const Center = styled('div')(({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
}));

const Artist = styled('div')(({
    fontSize: '20px',
}));

const Title = styled('div')(({
    fontSize: '30px',
    fontWeight: '600',
}));

const SliderWrapper = styled(Box)(({
    width: '100%',
    marginBottom: '10px',
}));

const ActionWrapper = styled(Box)(({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
}));

const PlayIcon = styled(PlayIconRaw)(({ theme }) =>({
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    transition: '200ms',
    margin: '30px 0px',

    '&:hover': {
        scale: '1.05',
        color: theme.palette.primary.main,
    },
}));

const PauseIcon = styled(PauseIconRaw)(({ theme }) => ({
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    transition: '200ms',
    margin: '30px 0px',

    '&:hover': {
        scale: '1.05',
        color: theme.palette.primary.main,
    },
}));

const MonitorIcon = styled(MonitorIconRaw)(({ theme }) => ({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',
    margin: '30px 0px',

    '&:hover': {
        scale: '1.05',
        color: theme.palette.primary.main,
    },
}));

const MonitorRedIcon = styled(MonitorIconRaw)(({ theme }) => ({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',
    margin: '30px 0px',
    color: theme.palette.primary.main,

    '&:hover': {
        scale: '1.05',
        color: theme.palette.error.main,
    },
}));
