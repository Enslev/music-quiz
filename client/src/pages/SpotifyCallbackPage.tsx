import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useActions } from '../overmind';

const SpotifyCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const { auth, spotify } = useActions();

    const [ searchParams ] = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        (async () => {
            await auth.loginWithCode(code ?? '');
            await spotify.initSpotifyValues();
            navigate('/');
        })();
    }, [ auth, code, navigate ]);

    return <></>;

};

export default SpotifyCallbackPage;
