import React from 'react';
import { Button } from '@mui/material';
import { useAppState } from '../overmind';

const LoginPage: React.FC = () => {

    const { apiUrl } = useAppState();

    const login = () => {
        window.location.href = `${apiUrl}/api/spotify/auth`;
    };

    return <>
        Login
        <Button variant="contained" onClick={login}>Login</Button>
    </>;
};

export default LoginPage;
