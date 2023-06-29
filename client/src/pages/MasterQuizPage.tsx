import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGridHost from '../components/quiz-grid-master/QuizGridHost';
import { TeamLabel } from '../components/quiz-grid-master/TeamLabel';
import { Button, FormControl, TextField, styled } from '@mui/material';
import { SpotifyPlayer } from '../components/Player/SpotifyPlayer';
import { Track } from '../overmind/effects/api/quizzes/types';

import { ReactComponent as SpotifyLogoRaw } from '../assets/user-plus.svg';
import RightMenu from '../components/RightMenu';

const MasterQuizPage: React.FC = () => {
    const { sessionCode } = useParams();
    const { session } = useAppState();
    const { loadSession, createteam } = useActions().sessions;

    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [addTeamMenuOpen, setAddTeamMenuOpen] = useState<boolean>(false);
    const [teamName, setTeamName] = useState<string>('');

    useEffect(() => {
        if (!sessionCode) return;
        loadSession(sessionCode);
    }, []);

    useEffect(() => {
        const allTracks = session?.categories.map((category) => category.tracks).flat(1);
        if (!allTracks) return;
        setAllTracks(allTracks);
    }, [session]);

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createteam(teamName);
        setAddTeamMenuOpen(false);
    };


    if (!session) return <></>;

    return <>
        <TeamsWrapper>
            {session.teams.length < 5 && <AddUserButton
                onClick={() => setAddTeamMenuOpen(true)}
            />}
            {session.teams.map((team) => <TeamLabel
                team={team}
                key={team._id}
            />)
            }
        </TeamsWrapper>
        <QuizGridHost
            categories={session.categories}
            revealed={session.revealed}
        />
        <SpotifyPlayer
            tracks={allTracks}
        />

        <RightMenu
            open={addTeamMenuOpen}
            handleClose={() => setAddTeamMenuOpen(false)}
        >
            <h1>Add team</h1>
            <FormControl fullWidth>
                <form onSubmit={onFormSubmit}>
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
    </>;
};

const TeamsWrapper = styled('div')(({
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',

    '> *': {
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

