import React, { useEffect, useState } from 'react';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz/types';
import { useParams } from 'react-router-dom';
import QuizGrid from '../components/quiz-grid/QuizGrid';

const PlayerScreenPage: React.FC = () => {

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
            revealed={[]}
        />
    </>;
};


export default PlayerScreenPage;
