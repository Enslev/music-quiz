import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGridHost from '../components/quiz-grid-master/QuizGridHost';
import { TeamLabel } from '../components/quiz-grid-master/TeamLabel';
import { styled } from '@mui/material';
import { SpotifyPlayer } from '../components/Player/SpotifyPlayer';
import { Category, Track } from '../overmind/effects/api/quizzes/types';

import { ReactComponent as AddUserButtonRaw } from '../assets/user-plus.svg';
import { Team } from '../overmind/effects/api/sessions/types';
import { PlayTrackMenu } from '../components/right-menus/PlayTrackMenu';
import { CreateTeamMenu } from '../components/right-menus/CreateTeamMenu';
import { EditTeamData, EditTeamMenu } from '../components/right-menus/EditTeamMenu';
import { SessionActionPayload, emitChallengeAction, useSessionSocket } from '../services/socket.service';

export const SessionHostPage: React.FC = () => {
    const { sessionCode } = useParams();
    const { session } = useAppState();
    const { loadSession, createteam, updateTeam, deleteTeam, claimTrack } = useActions().sessions;
    const { spotifyPlayer } = useAppState();

    const [ allTracks, setAllTracks ] = useState<Track[]>([]);
    const [ addTeamMenuOpen, setAddTeamMenuOpen ] = useState<boolean>(false);
    const [ editTeamMenuOpen, setEditTeamMenuOpen ] = useState<boolean>(false);
    const [ selectedTeam, setSelectedTeam ] = useState<Team | null>(null);
    const [ trackSelected, setTrackSelected ] = useState<{ track: Track, category: Category } | null>(null);
    const [ challengeIsOpen, setChallengeIsOpen ] = useState<boolean>(false);

    const socket = useSessionSocket(session?.code ?? null);

    useEffect(() => {
        if (!sessionCode) return;
        loadSession(sessionCode);
    }, []);

    useEffect(() => {
        const allTracks = session?.categories.map((category) => category.tracks).flat(1);
        if (!allTracks) return;
        setAllTracks(allTracks);
    }, [ session ]);

    const onCreateTeamSubmit = async (createTeamName: string) => {
        await createteam(createTeamName);
        setAddTeamMenuOpen(false);
    };

    const onEditTeamSubmit = (data: EditTeamData) => {
        if (!selectedTeam) return;

        switch (data.type) {
        case 'update': return handleUpdateTeam(selectedTeam, data);
        case 'delete': return handleDeleteTeam();
        }
    };

    const onWinner = async (track: Track, artistGuessed: boolean, winningTeam?: Team) => {
        setTrackSelected(null);

        if (winningTeam) {
            await handleUpdateTeam(winningTeam, {
                type: 'update',
                newPoints: track.points + (artistGuessed ? 100 : 0),
            });
        }

        await claimTrack({
            teamId: winningTeam?._id ?? null,
            trackId: track._id,
            artistGuessed,
        });

    };

    const handleUpdateTeam = async (team: Team, data: EditTeamData) => {
        const newPointsHistory = [ ...team.pointsHistory ];
        if (data.newPoints && data.newPoints != 0) {
            newPointsHistory.push(data.newPoints);
        }

        const newTeam: Team = {
            _id: team._id,
            name: data.teamName ?? team.name,
            pointsHistory: newPointsHistory,
        };

        await updateTeam(newTeam);
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

    const emitAction = (payload: SessionActionPayload) => {
        if (!socket) return;

        switch (payload.action.type) {
        case 'challengeAction:show': {
            if (challengeIsOpen && payload.action.show) return;
            if (!challengeIsOpen && !payload.action.show) return;

            emitChallengeAction(socket, payload);
            setChallengeIsOpen(payload.action.show);
            break;
        }
        case 'challengeAction:teamUpdate': {
            if (!challengeIsOpen) return;
            emitChallengeAction(socket, payload);
            break;
        }
        }

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
            revealed={session.claimed.map((claimed) => claimed.trackId)}
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
            open={Boolean(trackSelected)}
            category={trackSelected?.category}
            track={trackSelected?.track}
            teams={session.teams}
            onClose={() => setTrackSelected(null)}
            onWinner={onWinner}
            previousClaimed={
                session.claimed.find((claim) =>
                    claim.trackId == trackSelected?.track._id,
                ) ?? null
            }
            challengeIsOpen={challengeIsOpen}
            emitToSession={(action) => emitAction({
                sessionCode: session.code,
                action,
            })}
        />

        <SpotifyPlayer
            hide={Boolean(!spotifyPlayer.currentlyPlaying)}
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

const AddUserButton = styled(AddUserButtonRaw)(({ theme }) => ({
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

