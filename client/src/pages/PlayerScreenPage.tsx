import React, { useEffect, useState } from 'react';
import { useActions } from '../overmind';
import { useParams } from 'react-router-dom';
import QuizGrid from '../components/quiz-grid/QuizGrid';
import { Session } from '../overmind/actions/api/sessions/types';

const PlayerScreenPage: React.FC = () => {

    const { quizCode: sessionCode } = useParams();
    const { getSession } = useActions().api.sessions;
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        (async () => {
            const response = await getSession(sessionCode ?? 'noid');
            setSession(response);
        })();
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
