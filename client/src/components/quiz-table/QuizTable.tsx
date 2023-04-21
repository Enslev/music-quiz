import React from 'react';
import styled from 'styled-components';
import { Quiz } from '../../overmind/actions/api/quiz';
import CategoryBox from './CategoryBox';

interface propsType {
    revealed: string[],
    quiz: Quiz,
}

function QuizTable(props: propsType) {

    const { quiz, revealed } = props;

    return <CategoryView>
        {quiz.categories.map((category) => <CategoryBox
            key={category._id}
            category={category}
            revealed={revealed}
        />)}
    </CategoryView>;
}

export default QuizTable;

const CategoryView = styled.div`
    display: flex;
    justify-content: center;
`;
