import React from 'react';
import styled from 'styled-components';
import SpotifySignInButton from './SpotifySignInButton';

function HeaderComponent() {

    return <Header>
        <span>Music Quiz</span>
        {/* {isLoggedIn ?
            <Button variant='contained' onClick={logout}>Logout</Button> :
            <Button variant='contained' onClick={login}>Login</Button>
        } */}
        <SpotifySignInButton/>
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
