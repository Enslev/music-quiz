import React from 'react';
import { Team } from '../../overmind/effects/api/sessions/types';
import { styled } from '@mui/material';

interface Props {
    team: Team;
    onClick?: (team: Team) => void,
}

export const TeamLabel: React.FC<Props> = (props) => {

    const {
        team,
        onClick = () => {return;},
    } = props;

    const points = team.pointsHistory.reduce((acc, cur) => acc + cur, 0);

    return <LabelWrapper
        data-before={team.name}
        data-clickable={Boolean(onClick)}
        onClick={ () => onClick(team) }
    >
        <span>{team.name}</span>
        <span>{points}</span>
    </LabelWrapper>;
};

const LabelWrapper = styled('div')(({ theme }) => ({
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',

    'div[data-clickable=true]&:hover': {
        color: theme.palette.primary.main,
        fontWeight: '600',
    },

    // This is so that hovering doesn't push the other teamLabels
    'div[data-clickable=true]&::before': {
        content: 'attr(data-before)',
        fontWeight: '600',
        height: '0',
        overflow: 'hidden',
        visibility: 'hidden',
    },
}));
