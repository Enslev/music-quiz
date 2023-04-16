import React from 'react';
import { Button } from '@mui/material';
import styled from 'styled-components';
import { useActions, useAppState } from '../overmind';

function HeaderComponent() {

    const login = () => {
        window.location.href = 'http://localhost:9001/api/spotify/auth';
    };
    const {logout} = useActions().auth;
    const isLoggedIn = useAppState().isLoggedIn;

    return <Header>
        <span>Header</span>
        {isLoggedIn ? 
            <Button variant='contained' onClick={logout}>Logout</Button> :
            <Button variant='contained' onClick={login}>Login</Button>
        }
    </Header>;
}

export default HeaderComponent;

const Header = styled.div`
    background: LightSteelBlue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
`;