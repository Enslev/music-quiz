import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import QuizGrid from '../components/quiz-grid-master/QuizGrid';

const MasterQuizPage: React.FC = () => {


    const { quizId } = useParams();
    const { quiz } = useAppState();
    const { loadQuiz } = useActions().quiz;

    useEffect(() => {
        if (!quizId) return;
        loadQuiz(quizId);
    }, []);

    if (!quiz) return <></>;

    return <>
        <QuizGrid
            quiz={quiz}
            revealed={['6446c846ef3d95b10c5182ad']}
        />
    </>;
};

export default MasterQuizPage;

