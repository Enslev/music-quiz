import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGridHost from '../components/quiz-grid-master/QuizGridHost';
import { TeamLabel } from '../components/quiz-grid-master/TeamLabel';
import { styled } from '@mui/material';

const MasterQuizPage: React.FC = () => {
    const { sessionCode } = useParams();
    const { session } = useAppState();
    const { loadSession } = useActions().sessions;

    useEffect(() => {
        if (!sessionCode) return;
        loadSession(sessionCode);
    }, []);

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
    </>;
};

const TeamsWrapper = styled('div')(({
    width: '100vw',
    display: 'flex',
    justifyContent: 'space-around',

}));

export default MasterQuizPage;

