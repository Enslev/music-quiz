import React, { useEffect, useState } from 'react';
import { useActions, useAppState } from '../overmind';
import { useNavigate, useParams } from 'react-router-dom';
import QuizGrid from '../components/quiz-grid/QuizGrid';
import { TeamsBanner } from '../components/quiz-grid/TeamsBanner';
import { styled } from '@mui/material';
import { ChallengeOverlay, ChallengeOverlayOptions } from '../components/action-components/ChallengeOverlay';
import { SessionActionPayload, useSessionSocket } from '../services/socket.service';

const PlayerScreenPage: React.FC = () => {

    const { session } = useAppState();
    const navigate = useNavigate();
    const { loadSession, clearSession } = useActions().sessions;
    const { hideHeader, showHeader } = useActions().ui;
    const { sessionCode } = useParams();

    const socket = useSessionSocket(session?.code ?? null);

    const [challengeOpen, setChallengeOpen] = useState<boolean>(false);
    const [challengeOverlayOptions, setChallengeOverlayOptions] = useState<ChallengeOverlayOptions | null>(null);

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

        socket.on('sessionAction', (data: SessionActionPayload) => {
            switch (data.action.type) {
            case 'challengeAction': {
                if (data.action.show) {
                    setChallengeOverlayOptions({
                        categoryTitle: data.action.category,
                        trackPoints: data.action.points,
                    });
                    setChallengeOpen(true);
                } else  {

                    setChallengeOpen(false);
                }
            }
            }
        });

    }, [socket, sessionCode]);

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
            options={challengeOverlayOptions}
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
