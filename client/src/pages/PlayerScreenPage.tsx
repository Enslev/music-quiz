import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import { useParams } from 'react-router-dom';
import QuizTable from '../components/quiz-table/QuizTable';

function PlayerScreenPage() {

    const { quizId } = useParams();
    const { getQuiz } = useActions().api.quiz;
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        (async () => {
            const response = await getQuiz(quizId ?? 'noid');
            setQuiz(response);
            console.log(response);
        })();
    }, []);

    if (!quiz) return <div>loading</div>;

    return <div>
        <QuizTable quiz={quiz}/>

    </div>;
}


export default PlayerScreenPage;
