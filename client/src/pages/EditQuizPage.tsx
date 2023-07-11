import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import { useDebouncedCallback } from 'use-debounce';
import QuizGrid from '../components/quiz-grid/QuizGrid';
import { Button, styled } from '@mui/material';
import { clone } from '../services/utils';

const EditQuizPage: React.FC = () => {

    const { loadQuiz, saveQuiz } = useActions().quiz;
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { quiz } = useAppState();
    const { createSession } = useActions().sessions;

    const quizCopy = clone(quiz);

    useEffect(() => {
        if (!quizId) return;
        loadQuiz(quizId);
    }, []);

    const debouncedSave = useDebouncedCallback(async () => {
        if (!quiz || !quizCopy) return;
        await saveQuiz(quizCopy);
    }, 500);

    if (!quizId) {
        navigate('/');
        return <></>;
    }

    if (!quizCopy) return <></>;

    const handleCreateSession = async () => {
        if (!quiz) return;
        const session = await createSession(quiz._id);
        navigate(`/session/${session.code}/host`);
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
            categories={quizCopy.categories}
            editMode
            saveTrigger={debouncedSave}
            revealed={[ '6446c846ef3d95b10c5182ad' ]}
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

