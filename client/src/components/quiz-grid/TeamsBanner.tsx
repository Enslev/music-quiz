import React from 'react';
import { styled } from '@mui/material';
import { Team } from '../../overmind/effects/api/sessions/types';

interface Props {
    teams?: Team[],
    className: string,
}

export const TeamsBanner: React.FC<Props> = (props) => {

    const {
        teams = [],
        className,
    } = props;

    const sumPoints = (pointsHistory: number[]) => {
        return pointsHistory.reduce((point, acc) => acc += point, 0);
    };

    return <TeamsWrapper
        className={className}
    >
        {teams.map((team) =>
            <TeamWrapper
                key={team._id}
            >
                <TeamName>{team.name}</TeamName>
                <Points>{sumPoints(team.pointsHistory)}</Points>
            </TeamWrapper>,
        )}
    </TeamsWrapper>;
};
const TeamsWrapper = styled('div')(({
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
    height: '10vh',
    alignItems: 'flex-end',
}));

const TeamWrapper = styled('div')(({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0px 20px',
}));

const TeamName = styled('div')(({
    fontSize: '20px',
    fontWeight: '400',
}));

const Points = styled('div')(({
    fontSize: '30px',
}));
