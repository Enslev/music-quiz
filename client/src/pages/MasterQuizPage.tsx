import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGridHost from '../components/quiz-grid-master/QuizGridHost';
import { TeamLabel } from '../components/quiz-grid-master/TeamLabel';
import { styled } from '@mui/material';
import { SpotifyPlayer } from '../components/Player/SpotifyPlayer';
import { Track } from '../overmind/effects/api/quizzes/types';

const MasterQuizPage: React.FC = () => {
    const { sessionCode } = useParams();
    const { session } = useAppState();
    const { loadSession } = useActions().sessions;

    const [allTracks, setAllTracks] = useState<Track[]>([]);

    useEffect(() => {
        if (!sessionCode) return;
        loadSession(sessionCode);
    }, []);

    useEffect(() => {
        const allTracks = session?.categories.map((category) => category.tracks).flat(1);
        if (!allTracks) return;
        setAllTracks(allTracks);
    }, [session]);

    if (!session) return <></>;

    return <>
        <TeamsWrapper>
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
    </>;
};

const TeamsWrapper = styled('div')(({
    width: '100vw',
    display: 'flex',
    justifyContent: 'space-around',

}));

export default MasterQuizPage;

