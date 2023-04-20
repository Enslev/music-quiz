import React from 'react';
import styled from 'styled-components';
import SpotifySignInButton from './SpotifySignInButton';

function HeaderComponent() {

    return <Header>
        <SpotifySignInButton/>
    </Header>;
}

export default HeaderComponent;

const Header = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding: 10px 10px;
`;
