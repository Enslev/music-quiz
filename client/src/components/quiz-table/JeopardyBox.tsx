import React from 'react';
import styled from 'styled-components';
import { Quiz } from '../../overmind/actions/api/quiz';

interface propsType {
    isRevealed?: boolean,
    track: Quiz['categories'][number]['tracks'][number],
}

function JeopardyBox(props: propsType) {

    const { track, isRevealed } = props;

    if (isRevealed) {
        return <BoxWrapperRevealed>
            <span className='artist'>{track.artist}</span>
            <h3>{track.title}</h3>
        </BoxWrapperRevealed>;
    }


    return <BoxWrapperHidden>
        <span className='points'>{track.points}</span>
    </BoxWrapperHidden>;
}

export default JeopardyBox;

const BoxWrapperHidden = styled.div`
    height: 120px;

    background: rgb(50,102,112);
    background: linear-gradient(135deg, rgba(50,102,112,1) 0%, rgba(45,196,181,1) 100%);

    display: flex;
    justify-content: center;
    align-items: center;
    text-align : center;

    .points {
        font-size: 30px;
    }
`;

const BoxWrapperRevealed = styled.div`
    height: 120px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align : center;

    .artist {
        font-size: 15px;
    }
`;
