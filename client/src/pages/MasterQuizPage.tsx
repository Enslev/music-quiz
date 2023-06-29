import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGridHost from '../components/quiz-grid-master/QuizGridHost';
import { TeamLabel } from '../components/quiz-grid-master/TeamLabel';
import { Button, FormControl, TextField, styled } from '@mui/material';
import { SpotifyPlayer } from '../components/Player/SpotifyPlayer';
import { Category, Track } from '../overmind/effects/api/quizzes/types';

import { ReactComponent as SpotifyLogoRaw } from '../assets/user-plus.svg';
import RightMenu from '../components/RightMenu';
import { Team } from '../overmind/effects/api/sessions/types';
import PlayTrackMenu from '../components/quiz-grid-master/PlayTrackMenu';

const MasterQuizPage: React.FC = () => {
    const { sessionCode } = useParams();
    const { session } = useAppState();
    const { loadSession, createteam, updateTeam, deleteTeam } = useActions().sessions;

    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [addTeamMenuOpen, setAddTeamMenuOpen] = useState<boolean>(false);
    const [teamSettingsOpen, setTeamSettingsOpen] = useState<boolean>(false);
    const [teamName, setTeamName] = useState<string>('');
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [trackSelected, setTrackSelected] = useState<{track: Track, category: Category} | null>(null);

    useEffect(() => {
        if (!sessionCode) return;
        loadSession(sessionCode);
    }, []);

    useEffect(() => {
        const allTracks = session?.categories.map((category) => category.tracks).flat(1);
        if (!allTracks) return;
        setAllTracks(allTracks);
    }, [session]);

    const onCreateTeamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createteam(teamName);
        setAddTeamMenuOpen(false);
    };

    const onEditTeamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedTeam) return;

        const newTeam: Team = {
            _id: selectedTeam._id,
            name: teamName,
            pointsHistory: selectedTeam.pointsHistory,
        };

        updateTeam(newTeam);
        setTeamSettingsOpen(false);
    };

    const handleNewTeamClick = () => {
        setTeamName('');
        setAddTeamMenuOpen(true);
    };

    const handleTeamClick = (team: Team) => {
        setSelectedTeam(team);
        setTeamName(team.name);
        setTeamSettingsOpen(true);
    };

    const handleDeleteTeam = async (team: Team | null) => {
        if (!team) return;

        await deleteTeam(team);
        setTeamSettingsOpen(false);
    };

    const handleTrackSelect = (track: Track, category: Category) => {
        setTrackSelected({ track, category });
    };

    if (!session) return <></>;

    return <>
        <TeamsWrapper>
            {session.teams.map((team) => <TeamLabel
                team={team}
                key={team._id}
                onClick={handleTeamClick}
            />)
            }
            {session.teams.length < 5 && <AddUserButton
                onClick={handleNewTeamClick}
            />}
        </TeamsWrapper>

        <QuizGridHost
            categories={session.categories}
            revealed={session.revealed}
            selectTrack={handleTrackSelect}
        />

        <RightMenu
            open={addTeamMenuOpen}
            handleClose={() => setAddTeamMenuOpen(false)}
        >
            <h1>Add team</h1>
            <FormControl fullWidth>
                <form onSubmit={onCreateTeamSubmit}>
                    <TextField
                        id="new-quiz-name"
                        label="Team name"
                        variant="filled"
                        onChange={(e) => setTeamName(e.target.value)}
                        value={teamName}
                        fullWidth
                        style={{ 'marginBottom': '15px' }}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        {'Let\'s go!'}
                    </Button>
                </form>
            </FormControl>
        </RightMenu>

        <RightMenu
            open={teamSettingsOpen}
            handleClose={() => setTeamSettingsOpen(false)}
        >
            <div className='header'>
                <h1>{selectedTeam?.name}</h1>
            </div>

            <div className='content'>
                <FormControl fullWidth>
                    <form onSubmit={onEditTeamSubmit}>
                        <TextField
                            id="new-quiz-name"
                            label="Rename team"
                            variant="filled"
                            onChange={(e) => setTeamName(e.target.value)}
                            value={teamName}
                            fullWidth
                            style={{ 'marginBottom': '15px' }}
                        />
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            {'This is a better name!'}
                        </Button>
                    </form>
                </FormControl>
            </div>

            <div className='footer'>
                <Button
                    variant='contained'
                    color='error'
                    fullWidth
                    onClick={() => handleDeleteTeam(selectedTeam)}
                >
                    Delete team
                </Button>
            </div>
        </RightMenu>

        <PlayTrackMenu
            category={trackSelected?.category}
            track={trackSelected?.track}
            open={Boolean(trackSelected)}
            handleClose={() => setTrackSelected(null)}
        />

        <SpotifyPlayer
            hide={Boolean(trackSelected)}
            tracks={allTracks}
            disableKeybaord={teamSettingsOpen}
        />
    </>;
};

const TeamsWrapper = styled('div')(({
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',

    '> div': {
        margin: '0px 20px',
    },
}));

const AddUserButton = styled(SpotifyLogoRaw)(({ theme }) => ({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: '200ms',
    color: 'white',

    '&:hover': {
        scale: '1.05',
        color: theme.palette.primary.main,
    },
}));

export default MasterQuizPage;

