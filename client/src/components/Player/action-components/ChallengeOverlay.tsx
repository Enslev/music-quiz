import React, {  } from 'react';
import { PlayerOverlay } from './PlayerOverlay';
import { styled } from '@mui/material';

export interface ChallengeOverlayOptions {
    categoryTitle: string,
    trackPoints: number,
}

interface Props {
    open: boolean,
    options: ChallengeOverlayOptions
}

export const ChallengeOverlay: React.FC<Props> = (props) => {

    const { open, options } = props;

    return <PlayerOverlay open={open}>
        <Wrapper>
            <div  className='header'>
                <Category>
                    <span>{options.categoryTitle}</span>
                </Category>
                <Points>
                    <span>{options.trackPoints}</span>
                </Points>
            </div>
            <div className='footer'>
            </div>
        </Wrapper>
    </PlayerOverlay>;
};

const Wrapper = styled('div')(({
    height: '100%',
    display: 'flex',
    flexFlow: 'column',

    '.header': {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    '.footer': {
        flex: '0 1 30%',
        display: 'flex',
        justifyContent: 'center',
    },
}));

const Category = styled('div')(({
    fontSize: '80px',
}));

const Points = styled('div')(({
    fontSize: '130px',
    fontWeight: 'bold',
}));
