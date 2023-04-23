import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import QuizTable from '../components/quiz-table/QuizTable';
import { useDebouncedCallback } from 'use-debounce';

const EditQuizPage: React.FC = () => {

    const { quizId } = useParams();
    const { getQuiz } = useActions().api.quiz;
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const { putQuiz } = useActions().api.quiz;

    useEffect(() => {
        (async () => {
            const response = await getQuiz(quizId ?? 'noid');
            setQuiz(response);
        })();
    }, []);

    const debouncedSave = useDebouncedCallback(async() => {
        if (!quiz) return;
        const updatedQuiz = await putQuiz(quiz);
        setQuiz(updatedQuiz);
    }, 500);

    if (!quiz) return <></>;

    return <>
        <QuizTable
            quiz={quiz}
            saveTrigger={debouncedSave}
            editMode
        />
    </>;
};

export default EditQuizPage;

