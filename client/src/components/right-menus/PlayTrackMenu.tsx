import React, { useEffect, useRef, useState } from 'react';
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
import { useKeyboardShortcut } from '../../services/keyboard.service';

interface Props {
    category?: Category,
    track?: Track,
    teams: Team[],
    open: boolean,
    previousClaimed: Claimed | null;
    challengeIsOpen: boolean,
    emitToSession: (action: SessionAction) => void,
    onClose: () => void;
    onWinner: (track: Track, artistGuessed: boolean, team?: Team) => void;
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
    const { play, resume, pause, seek } = useActions().spotify;

    const [ currentTrackPosition, setCurrentTrackPosition ] = useState<number>(track?.startPosition ?? 0);
    const [ artistGuessed, setArtistGuessed ] = useState<boolean>(false);
    const [ sliderFocused, setSliderFocused ] = useState<boolean>(false);
    const [ winningTeamId, setWinningTeamId ] = useState<string | null>(null);

    const team1ButtonRef = useRef<HTMLButtonElement>(null);
    const team2ButtonRef = useRef<HTMLButtonElement>(null);
    const team3ButtonRef = useRef<HTMLButtonElement>(null);
    const team4ButtonRef = useRef<HTMLButtonElement>(null);
    const team5ButtonRef = useRef<HTMLButtonElement>(null);
    const allTeamButtons = [ team1ButtonRef, team2ButtonRef, team3ButtonRef, team4ButtonRef, team5ButtonRef ];

    useKeyboardShortcut([ '1', '2', '3', '4', '5' ], async (keyDown) => {
        switch (keyDown) {
        case '1': team1ButtonRef.current?.click(); break;
        case '2': team2ButtonRef.current?.click(); break;
        case '3': team3ButtonRef.current?.click(); break;
        case '4': team4ButtonRef.current?.click(); break;
        case '5': team5ButtonRef.current?.click(); break;
        }

        // Await 'Mui-selected' class being added to active team button
        await new Promise((resolve) => setTimeout(resolve));

        const anyTeamSelected = allTeamButtons.some((teamButton) =>
            teamButton.current?.classList.contains('Mui-selected'),
        );

        if (!spotifyPlayer.isPlaying && !anyTeamSelected) {
            resume();
        }

        if (spotifyPlayer.isPlaying && anyTeamSelected) {
            pause();
        }
    }, 500);

    useKeyboardShortcut('Enter', () => handleWinnerSubmit());

    useEffect(() => {
        if (!open) return;

        setArtistGuessed(previousClaimed?.artistGuessed ?? false);
        setCurrentTrackPosition(track?.startPosition ?? 0);
        setWinningTeamId(previousClaimed?.teamId || null);
    }, [ open ]);

    useEffect(() => {
        if (spotifyPlayer.currentlyPlaying != track?.trackUrl) return;
        if (sliderFocused) return;

        setCurrentTrackPosition(spotifyPlayer.playpackPosition ?? 0);
    }, [ spotifyPlayer.playpackPosition, sliderFocused, track ]);

    const handleStop = (e: React.MouseEvent) => {
        e.stopPropagation();
        pause();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!track) return;

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

    const handleTeamClick = async (team: Team, teamIdx: number) => {
        // Await class update from mui
        await new Promise((resolve) => setTimeout(resolve));
        const isActive = allTeamButtons[teamIdx].current?.classList.contains('Mui-selected');

        if (isActive) {
            emitToSession({
                type: 'challengeAction:teamUpdate',
                teamName: team.name,
            });
        } else {
            emitToSession({
                type: 'challengeAction:teamUpdate',
            });
        }
    };

    const clearOverlay = () => {
        emitToSession({
            type: 'challengeAction:teamUpdate',
        });
        emitToSession({
            type: 'challengeAction:show',
            show: false,
        });
    };

    const handleWinnerSubmit = () => {
        const winningTeam = teams.find((team) => team._id == winningTeamId);
        if (!track) return;

        clearOverlay();
        onWinner(track, artistGuessed, winningTeam);
    };

    return (
        <RightMenu
            open={open}
            onClose={() => {
                clearOverlay();
                onClose();
            }}
        >
            {category && track ? <>
                <RightMenuHeader>
                    <span>{category.title} - {track.points} </span>
                </RightMenuHeader>
                <RightMenuContent>
                    <Title className='title'>{track.title + ''}</Title>
                    <Artist className='artist'>{track.artist}</Artist>

                    <Center>
                        {(!spotifyPlayer.isPlaying || spotifyPlayer.currentlyPlaying != track.trackUrl) &&
                            <PlayIcon onClick={handlePlay} />
                        }

                        {(spotifyPlayer.isPlaying && spotifyPlayer.currentlyPlaying == track.trackUrl) &&
                            <PauseIcon onClick={handleStop} />
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
                                type: 'challengeAction:show',
                                show: false,
                            })}
                        />}
                        {!challengeIsOpen && <MonitorIcon
                            onClick={() => emitToSession({
                                type: 'challengeAction:show',
                                show: true,
                                categoryTitle: category.title,
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
                        {teams.map((team, idx) =>
                            <ToggleButton
                                key={team._id}
                                value={team._id}
                                aria-label={team.name}
                                color='primary'
                                fullWidth
                                ref={allTeamButtons[idx]}
                                onClick={() => handleTeamClick(team, idx)}
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
                        onClick={handleWinnerSubmit}
                    >
                        {previousClaimed ? 'Winner already selected' : 'This is the winner!'}
                    </Button>
                </RightMenuFooter>
            </> : <></>}

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

const PlayIcon = styled(PlayIconRaw)(({ theme }) => ({
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
