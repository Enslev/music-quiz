import React, { useEffect } from 'react';
import { useActions, useAppState } from '../overmind';
import { useNavigate, useParams } from 'react-router-dom';
import QuizGrid from '../components/quiz-grid/QuizGrid';

const PlayerScreenPage: React.FC = () => {

    const { session } = useAppState();
    const navigate = useNavigate();
    const { loadSession, clearSession } = useActions().sessions;
    const { sessionCode } = useParams();

    useEffect(() => {
        (async () => {
            if (!sessionCode) return navigate('/');
            const validSession = await loadSession(sessionCode);

            if (!validSession) {
                navigate(-1);
            }
        })();

        return () => {
            clearSession();
        };
    }, []);

    if (!session) return <></>;

    return <>
        <QuizGrid
            categories={session.categories}
            revealed={[]}
        />
    </>;
};


export default PlayerScreenPage;
