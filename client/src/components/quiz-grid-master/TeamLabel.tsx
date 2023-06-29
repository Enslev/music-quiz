import React from 'react';
import { Team } from '../../overmind/effects/api/sessions/types';
import { styled } from '@mui/material';

interface Props {
    team: Team;
}

export const TeamLabel: React.FC<Props> = (props) => {

    const { team } = props;
    const points = team.pointsHistory.reduce((acc, cur) => acc + cur, 0);

    return <LabelWrapper>
        <span>{team.name}</span>
        <span>{points}</span>
    </LabelWrapper>;
};

const LabelWrapper = styled('div')(({
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
