import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGridHost from '../components/quiz-grid-master/QuizGridHost';

const MasterQuizPage: React.FC = () => {


    const { sessionCode } = useParams();
    const { session } = useAppState();
    const { loadSession } = useActions().sessions;

    useEffect(() => {
        if (!sessionCode) return;
        loadSession(sessionCode);
    }, []);

    console.log(session);
    if (!session) return <></>;

    return <>
        <QuizGridHost
            categories={session.categories}
            revealed={['6446c846ef3d95b10c5182ad']}
        />
    </>;
};

export default MasterQuizPage;

