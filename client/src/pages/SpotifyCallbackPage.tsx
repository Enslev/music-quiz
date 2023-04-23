import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useActions } from '../overmind';

const SpotifyCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const { auth } = useActions();

    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {

        auth.loginWithCode(code ?? '').then(() => {
            navigate('/');
        });
    }, [auth, code, navigate]);

    return <></>;

};

export default SpotifyCallbackPage;
