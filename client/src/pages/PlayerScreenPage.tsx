import React, { useEffect, useState } from 'react';
import { useActions, useAppState } from '../overmind';
import { useNavigate, useParams } from 'react-router-dom';
import QuizGrid from '../components/quiz-grid/QuizGrid';
import { TeamsBanner } from '../components/quiz-grid/TeamsBanner';
import { styled } from '@mui/material';
import { ChallengeOverlay } from '../components/Player/action-components/ChallengeOverlay';
import { useSessionSocket } from '../services/socket.service';

const PlayerScreenPage: React.FC = () => {

    const { session } = useAppState();
    const navigate = useNavigate();
    const { loadSession, clearSession } = useActions().sessions;
    const { hideHeader, showHeader } = useActions().ui;
    const { sessionCode } = useParams();

    const socket = useSessionSocket(session?.code ?? null);

    const [challengeOpen] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            if (!sessionCode) return navigate('/');
            const validSession = await loadSession(sessionCode);

            if (!validSession) {
                navigate(-1);
            }

            hideHeader();
        })();

        return () => {
            clearSession();
            showHeader();
        };
    }, []);

    useEffect(() => {
        if (socket == null || !sessionCode) return;

        socket.on('update', () => {
            loadSession(sessionCode);
        });

    }, [socket, sessionCode]);

    // useEffect(() => {
    //     setTimeout(() => setChallengeOpen(true), 1000);
    //     setTimeout(() => setChallengeOpen(false), 6000);
    // }, []);

    if (!session) return <></>;

    return <Wrapper>
        <TeamsBanner
            teams={session.teams}
            className='teams'
        />
        <QuizGrid
            className='quiz'
            categories={session.categories}
            revealed={session.claimed.map((claim) => claim.trackId)}
        />

        <ChallengeOverlay
            open={challengeOpen}
            options={{
                categoryTitle: 'Straights Out The Fridge',
                trackPoints: 500,
            }}
        />
    </Wrapper>;
};

const Wrapper = styled('div')(({
    display: 'flex',
    flexFlow: 'column',
    height: '100vh',

    '.teams': {
        flex: '0 1 auto',
    },

    '.quiz ': {
        flex: '1 1 auto',

        display: 'flex',
        alignItems: 'flex-start',
    },
}));


export default PlayerScreenPage;
