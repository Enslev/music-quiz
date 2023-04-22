import React from 'react';
import styled from 'styled-components';
import { Quiz } from '../../overmind/actions/api/quiz';
import CategoryBox from './CategoryBox';

interface Props {
    revealed: string[],
    quiz: Quiz,
}

const QuizTable: React.FC<Props> = (props) => {

    const { quiz, revealed } = props;

    return <CategoryView>
        {quiz.categories.map((category) => <CategoryBox
            key={category._id}
            category={category}
            revealed={revealed}
        />)}
    </CategoryView>;
};

export default QuizTable;

const CategoryView = styled.div`
    display: flex;
    justify-content: center;
`;
