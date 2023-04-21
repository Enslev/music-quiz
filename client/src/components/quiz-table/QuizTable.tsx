import React from 'react';
import styled from 'styled-components';
import { Quiz } from '../../overmind/actions/api/quiz';
import CategoryBox from './CategoryBox';

interface propsType {
    isRevealed?: boolean,
    quiz: Quiz,
}

function QuizTable(props: propsType) {

    const { quiz } = props;

    return <CategoryView>
        {quiz.categories.map((category) => <CategoryBox category={category} key={category._id}/>)}
    </CategoryView>;
}

export default QuizTable;

const CategoryView = styled.div`
    display: flex;
    justify-content: center;
`;
