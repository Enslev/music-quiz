import { TextField, Button, styled, FormControl } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RightMenu, RightMenuContent, RightMenuFooter, RightMenuHeader } from '../RightMenu';
import { Team } from '../../overmind/effects/api/sessions/types';

export interface EditTeamData {
    type: 'update' | 'delete';
    _id: string;
    teamName?: string;
    newPoints?: number;
}

interface Props {
    open: boolean;
    team: Team | null,
    onClose: () => void;
    onSubmit: (data: EditTeamData) => void;
}

export const EditTeamMenu: React.FC<Props> = (props) => {

    const {
        open,
        onClose,
        onSubmit,
        team,
    } = props;

    const [teamName, setTeamName] = useState<string>('');
    const [newPoints, setNewPoints] = useState<string>('');

    useEffect(() => {
        if (!open || !team) return;

        setTeamName(team?.name);
        setNewPoints('0');
    }, [open]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!team) return;

        onSubmit({
            type: 'update',
            _id: team._id,
            newPoints: Number(newPoints),
            teamName,
        });
    };

    const handleDeleteTeam = () => {
        if (!team) return;

        onSubmit({
            type: 'delete',
            _id: team?._id,
        });
    };

    return <RightMenu
        open={open}
        onClose={onClose}
    >
        <RightMenuHeader>
            <h1>{team?.name}</h1>
        </RightMenuHeader>

        <RightMenuContent>
            <StyledForm fullWidth>
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="edit-team-name"
                        label="Rename team"
                        variant="filled"
                        onChange={(e) => setTeamName(e.target.value)}
                        value={teamName}
                        fullWidth
                        className='text-field'
                    />

                    <TextField
                        id="new-quiz-points"
                        label="points"
                        variant="filled"
                        onChange={(e) => {
                            let newValue = e.target.value;
                            newValue = newValue.replace(/,/g , '.');

                            if (newValue == '') newValue = '0';

                            if (newValue.length > 1 && !newValue.match(/^0\./)) {
                                newValue = newValue.replace(/^0*/, '');
                            }

                            if (!newValue.match(/^[0-9-]([0-9.]+)?$/) ||
                            (newValue.match(/\./g)?.length ?? 0) > 1
                            ) {
                                return;
                            }

                            setNewPoints(newValue);
                        }}
                        value={newPoints}
                        fullWidth
                        type="text"
                        className='text-field'
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        {'I\'m done!'}
                    </Button>
                </form>
            </StyledForm>
        </RightMenuContent>

        <RightMenuFooter>
            <Button
                variant='contained'
                color='error'
                fullWidth
                onClick={() => handleDeleteTeam()}
            >
            DELETE TEAM
            </Button>
        </RightMenuFooter>
    </RightMenu>;
};

const StyledForm = styled(FormControl)(({
    '.text-field': {
        marginBottom: '10px',
    },
}));
