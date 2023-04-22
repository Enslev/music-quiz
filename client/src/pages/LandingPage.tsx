import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import { Button } from '@mui/material';
import RightMenu from '../components/RightMenuComponent';

const LandingPage: React.FC = () => {

    const state = useAppState();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
    const { getQuizzes } = useActions().api.quiz;

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

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
    return <>
        <h1>Landing</h1>
        <Button variant='contained' onClick={() => setModalIsOpen(!modalIsOpen)}>Open modal</Button>
        {quizzes && quizzes.map((quiz) => <Link key={quiz._id} to={`/quiz/${quiz._id}`}>{quiz.title}</Link>)}
        <RightMenu
            open={modalIsOpen}
            handleClose={() => setModalIsOpen(false)}
        >
            <h1>Right menu</h1>
        </RightMenu>
    </>;
};

export default LandingPage;
