import React from 'react';
import { Button } from '@mui/material';

function LoginPage() {

    const login = () => {
        window.location.href = 'http://localhost:9001/api/spotify/auth';
    };

    return <>
        Login
        <Button variant="contained" onClick={login}>Login</Button>
    </>;
}

export default LoginPage;