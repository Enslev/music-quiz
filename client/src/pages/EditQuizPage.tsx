import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz/types';
import { useDebouncedCallback } from 'use-debounce';
import QuizGrid from '../components/quiz-grid/QuizGrid';
import { Button, styled } from '@mui/material';

const EditQuizPage: React.FC = () => {

    const { quizId } = useParams();
    const navigate = useNavigate();
    const { getQuiz, putQuiz } = useActions().api.quiz;
    const { createQuiz } = useActions().api.sessions;
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

    const handleCreateSession = async () => {
        const session = await createQuiz({ quizId: quiz._id });
        navigate(`/session/${session.code}`);
    };

    return <>
        <ButtonWrapper>
            <Button
                variant='contained'
                onClick={handleCreateSession}
            >
                    Start session
            </Button>
        </ButtonWrapper>
        <QuizGrid
            quiz={quiz}
            editMode
            saveTrigger={debouncedSave}
            revealed={['6446c846ef3d95b10c5182ad']}
        />
    </>;
};

const ButtonWrapper = styled('div')(({
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
}));

export default EditQuizPage;

