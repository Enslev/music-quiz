import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGridHost from '../components/quiz-grid-master/QuizGridHost';
import { TeamLabel } from '../components/quiz-grid-master/TeamLabel';
import { styled } from '@mui/material';
import { SpotifyPlayer } from '../components/Player/SpotifyPlayer';
import { Category, Track } from '../overmind/effects/api/quizzes/types';

import { ReactComponent as SpotifyLogoRaw } from '../assets/user-plus.svg';
import { Team } from '../overmind/effects/api/sessions/types';
import { PlayTrackMenu } from '../components/right-menus/PlayTrackMenu';
import { CreateTeamMenu } from '../components/right-menus/CreateTeamMenu';
import { EditTeamData, EditTeamMenu } from '../components/right-menus/EditEamMenu';

const MasterQuizPage: React.FC = () => {
    const { sessionCode } = useParams();
    const { session } = useAppState();
    const { loadSession, createteam, updateTeam, deleteTeam } = useActions().sessions;
    const { spotifyPlayer } = useAppState();

    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [addTeamMenuOpen, setAddTeamMenuOpen] = useState<boolean>(false);
    const [editTeamMenuOpen, setEditTeamMenuOpen] = useState<boolean>(false);
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

    const onCreateTeamSubmit = async (createTeamName: string) => {
        await createteam(createTeamName);
        setAddTeamMenuOpen(false);
    };

    const onEditTeamSubmit = (data: EditTeamData) => {
        switch (data.type) {
        case 'update': return handleUpdateTeam(data);
        case 'delete': return handleDeleteTeam();
        }
    };

    const handleUpdateTeam = (data: EditTeamData) => {
        if (!selectedTeam) return;

        const newPointsHistory = [...selectedTeam.pointsHistory];
        if (data.newPoints && data.newPoints != 0) {
            newPointsHistory.push(data.newPoints);
        }

        const newTeam: Team = {
            _id: selectedTeam._id,
            name: data.teamName ?? selectedTeam.name,
            pointsHistory: newPointsHistory,
        };

        updateTeam(newTeam);
        setEditTeamMenuOpen(false);
    };

    const handleDeleteTeam = async () => {
        if (!selectedTeam?._id) return;

        await deleteTeam(selectedTeam);
        setEditTeamMenuOpen(false);
    };

    const openCreateTeamMenu = () => {
        setAddTeamMenuOpen(true);
    };

    const handleTeamClick = (team: Team) => {
        setSelectedTeam(team);
        setEditTeamMenuOpen(true);
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
                onClick={openCreateTeamMenu}
            />}
        </TeamsWrapper>

        <QuizGridHost
            categories={session.categories}
            revealed={[]}
            selectTrack={handleTrackSelect}
        />

        <CreateTeamMenu
            open={addTeamMenuOpen}
            onClose={() => setAddTeamMenuOpen(false)}
            onSubmit={onCreateTeamSubmit}
        />

        <EditTeamMenu
            open={editTeamMenuOpen}
            team={selectedTeam}
            onClose={() => setEditTeamMenuOpen(false)}
            onSubmit={onEditTeamSubmit}
        />

        <PlayTrackMenu
            category={trackSelected?.category}
            track={trackSelected?.track}
            open={Boolean(trackSelected)}
            onClose={() => setTrackSelected(null)}
        />

        <SpotifyPlayer
            hide={spotifyPlayer.currentlyPlaying == trackSelected?.track.trackUrl}
            tracks={allTracks}
            disableKeybaord={editTeamMenuOpen || addTeamMenuOpen}
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

