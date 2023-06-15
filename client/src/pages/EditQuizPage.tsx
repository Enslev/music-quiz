import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import { useDebouncedCallback } from 'use-debounce';
import QuizGrid from '../components/quiz-grid/QuizGrid';

const EditQuizPage: React.FC = () => {

    const { quizId } = useParams();
    const { getQuiz, putQuiz } = useActions().api.quiz;
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        (async () => {
            const response = await getQuiz(quizId ?? 'noid');
            setQuiz(response);
        })();
    }, []);

    const debouncedSave = useDebouncedCallback(async() => {
        if (!quiz) return;
        await putQuiz(quiz);
    }, 500);

    if (!quiz) return <></>;

    return <>
        <QuizGrid
            quiz={quiz}
            editMode
            saveTrigger={debouncedSave}
            revealed={['6446c846ef3d95b10c5182ad']}
        />
    </>;
};

export default EditQuizPage;

