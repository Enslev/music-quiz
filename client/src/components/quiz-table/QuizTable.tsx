import React from 'react';
import { Quiz } from '../../overmind/actions/api/quiz';
import CategoryBox from './CategoryBox';
import { styled } from '@mui/material';
import { noop } from '../../services/utils';

interface Props {
    editMode?: boolean;
    revealed?: string[],
    quiz: Quiz,
    saveTrigger?: () => void;
}

const QuizTable: React.FC<Props> = (props) => {

    const {
        quiz,
        revealed,
        saveTrigger,
        editMode = false,
    } = props;

    return <CategoryView>
        {quiz.categories.map((category) => <CategoryBox
            key={category._id}
            category={category}
            revealed={revealed}
            editMode={editMode}
            saveTrigger={saveTrigger ?? noop}
        />)}
    </CategoryView>;
};

export default QuizTable;

const CategoryView = styled('div')`
    display: flex;
    justify-content: center;
`;
