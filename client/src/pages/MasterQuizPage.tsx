import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import QuizGrid from '../components/quiz-grid-master/QuizGrid';

const MasterQuizPage: React.FC = () => {

    const { quizId } = useParams();
    const { getQuiz } = useActions().api.quiz;
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        (async () => {
            const response = await getQuiz(quizId ?? 'noid');
            setQuiz(response);
        })();
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

