import React, { useEffect, useState } from 'react';
import { RightMenu } from '../RightMenu';
import { Button, FormControl, TextField } from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (creatTeamName: string) => void;
}

export const CreateTeamMenu: React.FC<Props> = (props) => {

    const {
        open,
        onClose,
        onSubmit,
    } = props;

    const [ teamName, setTeamName ] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(teamName);
    };

    useEffect(() => {
        if (!open) return;
        setTeamName('');
    }, [ open ]);

    return <RightMenu
        open={open}
        onClose={onClose}
    >
        <h1>Add team</h1>
        <FormControl fullWidth>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="new-team-name"
                    label="Team name"
                    variant="filled"
                    onChange={(e) => setTeamName(e.target.value)}
                    value={teamName}
                    fullWidth
                    style={{ 'marginBottom': '15px' }}
                />
                <Button type="submit" fullWidth variant="contained" color="primary">
                    {'Let\'s go!'}
                </Button>
            </form>
        </FormControl>
    </RightMenu>;
};
