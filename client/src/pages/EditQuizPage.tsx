import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import { styled } from '@mui/material';

const EditQuizPage: React.FC = () => {
    const { quizId } = useParams();
    const { getQuiz } = useActions().api.quiz;
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        (async () => {
            const response = await getQuiz(quizId ?? 'noid');
            console.log(response);
            setQuiz(response);
        })();
    }, []);

    return <>
        <QuizGrid>
            <div>title</div>
            <div>100</div>
            <div>200</div>
            <div>300</div>
            <div>400</div>
            <div>500</div>
        </QuizGrid>
    </>;
};

export default EditQuizPage;

const QuizGrid = styled('div')`
    display: grid;
`;
