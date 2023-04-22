import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import { Button, FormControl, TextField } from '@mui/material';
import RightMenu from '../components/RightMenuComponent';

const LandingPage: React.FC = () => {

    const state = useAppState();
    const navigate = useNavigate();
    const { createQuiz } = useActions().api.quiz;
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
    const { getQuizzes } = useActions().api.quiz;

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [newQuizTitle, setNewQuizTitle] = useState<string>('');

    // Send user to login if no login token is found
    useEffect(() => {
        if (!state.isLoggedIn) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        (async () => {
            if (!state.isLoggedIn) return;

            const response = await getQuizzes();
            setQuizzes(response);
        })();
    }, []);


    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = createQuiz({
            title: newQuizTitle,
        });
        console.log(response);

    };

    return <>
        <h1>Landing</h1>
        <Button variant='contained' onClick={() => setModalIsOpen(!modalIsOpen)}>Open modal</Button>
        {quizzes && quizzes.map((quiz) => <Link key={quiz._id} to={`/quiz/${quiz._id}`}>{quiz.title}</Link>)}
        <RightMenu
            open={modalIsOpen}
            handleClose={() => setModalIsOpen(false)}
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

export default LandingPage;
