import React from 'react';
import styled from 'styled-components';
import { Quiz } from '../../overmind/actions/api/quiz';
import JeopardyBox from './JeopardyBox';

interface Props {
    revealed: string[];
    category: Quiz['categories'][number];
}

const CategoryBox: React.FC<Props> = (props)  => {

    const { category, revealed } = props;

    return <CategoryContainer key={category._id} className='container'>
        <CategoryHeader><h3>{category.title}</h3></CategoryHeader>
        {category.tracks.map((track) => (
            <JeopardyBox
                key={track._id}
                track={track}
                isRevealed={revealed.includes(track._id)}
            />
        ))}
    </CategoryContainer>;
};

export default CategoryBox;

const CategoryHeader = styled.div`
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align : center;
    padding: 0px 30px;
    
`;
const CategoryContainer = styled.div`
    width: 250px;
    color: white;
    border-top: 2px solid #2DC4B5;
    border-right: 2px solid #2DC4B5;
    border-bottom: 2px solid #2DC4B5;

    :nth-child(1) {
        border-left: 2px solid #2DC4B5;
    }

    >:not(:nth-child(1)) {
        border-top: 2px solid #2DC4B5;
    }
`;
