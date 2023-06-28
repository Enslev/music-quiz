import React, { useEffect } from 'react';
import { useActions, useAppState } from '../overmind';
import { useNavigate, useParams } from 'react-router-dom';
import QuizGrid from '../components/quiz-grid/QuizGrid';

const PlayerScreenPage: React.FC = () => {

    const { session } = useAppState();
    const navigate = useNavigate();
    const { loadSession } = useActions().sessions;
    const { sessionCode } = useParams();

    useEffect(() => {
        if (!sessionCode) return navigate('/');
        loadSession(sessionCode);
    }, []);

    if (!session) return <></>;

    console.log(session);

    return <>
        <QuizGrid
            categories={session.categories}
            revealed={[]}
        />
    </>;
};


export default PlayerScreenPage;
