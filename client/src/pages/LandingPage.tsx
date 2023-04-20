import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useActions, useAppState } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';

function LandingPage() {

    const state = useAppState();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
    const { getQuizzes } = useActions().api.quiz;


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
        {quizzes && quizzes.map((quiz) => <Link key={quiz._id} to={`/quiz/${quiz._id}`}>{quiz.title}</Link>)}
    </>;
}

export default LandingPage;
