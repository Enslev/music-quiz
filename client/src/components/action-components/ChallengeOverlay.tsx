import React, { useEffect, useState } from 'react';
import { PlayerOverlay } from './PlayerOverlay';
import { Fade, styled } from '@mui/material';

interface Props {
    open: boolean,
    categoryTitle: string,
    trackPoints: number,
    teamName: string | null,
}

export const ChallengeOverlay: React.FC<Props> = (props) => {

    const { open, categoryTitle, trackPoints, teamName } = props;

    const [ teamToShow, setTeamToShow ] = useState<string | null>(null);
    const [ showTeam, setShowTeam ] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            // Async IIFE to await animation
            if (teamName) {
                if (teamToShow) {
                    setShowTeam(false);
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }

                setShowTeam(true);
                setTeamToShow(teamName);
            }

            if (!teamName) {
                setShowTeam(false);
                await new Promise((resolve) => setTimeout(resolve, 500));
                setTeamToShow(null);
            }
        })();
    }, [ teamName ]);

    return <PlayerOverlay open={open}>
        <Wrapper>
            <div  className='header'>
                <Category>{categoryTitle}</Category>
                <Points>{trackPoints}</Points>
            </div>
            <div className='footer'>
                <Fade in={showTeam} timeout={500}>
                    <TeamWrapper>
                        <span>Turn to guess:</span>
                        <TeamName>{teamToShow}</TeamName>
                    </TeamWrapper>
                </Fade>
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
    },
}));

const Category = styled('div')(({
    fontSize: '80px',
}));

const Points = styled('div')(({
    fontSize: '130px',
    fontWeight: 'bold',
}));

const TeamName = styled('div')(({
    fontSize: '100px',
    fontWeight: 'bold',
}));

const TeamWrapper = styled('div')(({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    span: {
        fontSize: '40px',
        fontWeight: 'bold',
    },
}));
