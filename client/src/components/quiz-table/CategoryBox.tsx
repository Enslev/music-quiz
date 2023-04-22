import React, { useState } from 'react';
import { Quiz } from '../../overmind/actions/api/quiz';
import JeopardyBox from './JeopardyBox';
import { TextField, styled } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
    editMode?: boolean;
    revealed?: string[];
    category: Quiz['categories'][number];
    saveTrigger: () => void;
}

const CategoryBox: React.FC<Props> = (props)  => {

    const {
        category,
        revealed,
        saveTrigger,
        editMode = false,
    } = props;

    const [categoryTitle, setCategoryTitle] = useState<string>(category.title);
    const saveCategoryTitle = useDebouncedCallback((value: string) => {
        category.title = value;
        saveTrigger();
    }, 500);
    const handleCategoryTitleChange = (newValue: string) => {
        setCategoryTitle(newValue);
        saveCategoryTitle(newValue);
    };

    return <CategoryContainer key={category._id} className='container'>
        {editMode && <CategoryHeader>
            <TextField
                value={categoryTitle}
                size='small'
                variant='standard'
                placeholder='Set Title'
                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                onChange={(e) => handleCategoryTitleChange(e.target.value)}
                multiline={true}
            />
        </CategoryHeader>}
        {!editMode && <CategoryHeader><h3>{category.title}</h3></CategoryHeader>}

        {category.tracks.map((track) => (
            <JeopardyBox
                key={track._id}
                track={track}
                isRevealed={revealed ? revealed.includes(track._id) : false}
            />
        ))}
    </CategoryContainer>;
};

export default CategoryBox;


const CategoryHeader = styled('div')`
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align : center;
    padding: 0px 30px;
    
`;
const CategoryContainer = styled('div')`
    width: 250px;
    color: white;
    border-top: 2px solid #2DC4B5;
    border-right: 2px solid #2DC4B5;
    border-bottom: 2px solid #2DC4B5;

    :nth-of-type(1) {
        border-left: 2px solid #2DC4B5;
    }

    >:not(:nth-of-type(1)) {
        border-top: 2px solid #2DC4B5;
    }
`;
