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

    if (!session) return <></>;

    return <>
        <QuizGridHost
            categories={session.categories}
            revealed={['649c23fca364346a745be426']}
        />
    </>;
};

export default MasterQuizPage;

