import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import { Quiz } from '../overmind/effects/api/quizzes/types';
import { Button, FormControl, TextField, styled } from '@mui/material';
import { RightMenu } from '../components/RightMenu';

const LandingPage: React.FC = () => {

    const state = useAppState();
    const navigate = useNavigate();

    const { getAllQuizzes, createQuiz } = useActions().quiz;

    const [ quizzes, setQuizzes ] = useState<Quiz[] | null>(null);

    const [ modalIsOpen, setModalIsOpen ] = useState<boolean>(false);
    const [ newQuizTitle, setNewQuizTitle ] = useState<string>('');

    useEffect(() => {
        (async () => {
            if (!state.isLoggedIn) return;

            const quizzes = await getAllQuizzes();
            setQuizzes(quizzes);
        })();
    }, []);


    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createQuiz(newQuizTitle);

        const quizzes = await getAllQuizzes();
        setQuizzes(quizzes);

        setModalIsOpen(false);
    };

    return <>
        <h1>Landing</h1>
        <ButtonWrapper>
            <Button variant='contained' onClick={() => setModalIsOpen(!modalIsOpen)}>Create quiz</Button>
            <Button variant='contained' onClick={() => navigate('/session')}>Join session</Button>
        </ButtonWrapper>
        <ul>
            {quizzes && quizzes.map((quiz) => <li key={quiz._id}><Link to={`/quiz/${quiz._id}/edit`}>{quiz.title}</Link></li>)}
        </ul>
        <RightMenu
            open={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
        >
            <h1>Create new quiz</h1>
            <FormControl fullWidth>
                <form onSubmit={onFormSubmit}>
                    <TextField
                        id="new-quiz-name"
                        label="Quiz name"
                        variant="filled"
                        onChange={(e) => setNewQuizTitle(e.target.value)}
                        value={newQuizTitle}
                        fullWidth
                        style={{ 'marginBottom': '15px' }}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        {'Let\'s go!'}
                    </Button>
                </form>
            </FormControl>
        </RightMenu>
    </>;
};

const ButtonWrapper = styled('div')(({
    button: {
        margin: '0px 10px',
    },
}));

export default LandingPage;
