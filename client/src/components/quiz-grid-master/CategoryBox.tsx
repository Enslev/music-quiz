import React from 'react';
import { Category } from '../../overmind/effects/api/quizzes/types';
import { styled } from '@mui/material';

interface Props {
    category: Category;
}

const CategoryBox: React.FC<Props> = ({
    category,
}) => {

    return (
        <BoxWrapper>
            <CategoryTitle>{category.title}</CategoryTitle>
        </BoxWrapper>
    );
};

const BoxWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    textAlign: 'center',
}));

const CategoryTitle = styled('h3')({
    'text-align': 'center',
    'text-wrap': 'balance',
});

export default CategoryBox;
