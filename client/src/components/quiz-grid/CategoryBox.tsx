import React, { useState } from 'react';
import { Category } from '../../overmind/actions/api/quiz';
import { TextField, styled } from '@mui/material';

interface Props {
    category: Category;
    editMode: boolean;
    saveTrigger: () => void;
}

const CategoryBox: React.FC<Props> = ({
    category,
    editMode,
    saveTrigger,
}) => {

    const [categoryTitle, setCategoryTitle] = useState<string>(category.title);

    function handleChange(value: string): void {
        setCategoryTitle(value);
    }

    function handleBlur(): void {
        if (category.title != categoryTitle) {
            category.title = categoryTitle;
            saveTrigger();
        }
    }

    return (<>
        {editMode && <BoxWrapper>
            <TextField
                value={categoryTitle}
                onChange={(e) => handleChange(e.target.value)}
                variant='standard'
                placeholder='Set Title'
                multiline={true}
                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                onBlur={() => handleBlur()}
                fullWidth
            />
        </BoxWrapper>}
        {!editMode && <BoxWrapper>
            <h3>{category.title}</h3>
        </BoxWrapper>}
    </>);
};

const BoxWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
}));

export default CategoryBox;
