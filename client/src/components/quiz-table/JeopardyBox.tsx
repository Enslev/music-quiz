import React from 'react';
import { Quiz } from '../../overmind/actions/api/quiz';
import { styled } from '@mui/material';

interface Props {
    isRevealed?: boolean,
    track: Quiz['categories'][number]['tracks'][number],
}

const JeopardyBox: React.FC<Props> = (props) => {

    const { track, isRevealed } = props;

    return <BoxWrapperHidden className={isRevealed ? '': 'hidden'}>
        {isRevealed && (<div>
            <span className='artist'>{track.artist}</span>
            <h3>{track.title}</h3>
        </div>)}
        {!isRevealed && (<div className='hidden-content'>
            <span className='points'>{track.points}</span>
        </div>)}
    </BoxWrapperHidden>;
};

export default JeopardyBox;

const BoxWrapperHidden = styled('div')`
    height: 120px;

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align : center;

    &.hidden {
        background: rgb(50,102,112);
        background: linear-gradient(135deg, rgba(50,102,112,1) 0%, rgba(45,196,181,1) 100%);
    }

    .points {
        font-size: 30px;
    }

    .artist {
        font-size: 15px;
    }
`;
