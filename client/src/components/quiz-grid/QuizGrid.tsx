import React from 'react';
import { styled } from '@mui/material';
import CategoryBox from './CategoryBox';
import { noop } from '../../services/utils';
import TrackBox from './TrackBox';
import { Category } from '../../overmind/effects/api/quizzes/types';

interface Props {
    editMode?: boolean;
    revealed?: string[],
    categories: Category[] | null,
    className?: string,
    saveTrigger?: () => void;
}

const QuizGrid: React.FC<Props> = (props) => {

    const {
        categories,
        revealed,
        saveTrigger,
        editMode = false,
        className,
    } = props;

    if (!categories) return <></>;

    return (
        <QuizWrapper className={className}>
            <QuizGridWrapper>
                {categories.map((category) => {
                    return <React.Fragment
                        key={category._id}
                    >
                        <CategoryBox
                            category={category}
                            editMode={editMode}
                            saveTrigger={saveTrigger ?? noop}
                        />
                        {category.tracks.map((track) => <TrackBox
                            key={track._id}
                            track={track}
                            editMode={editMode}
                            revealed={revealed?.includes(track._id) ?? false}
                            saveTrigger={saveTrigger ?? noop}
                        />)}
                    </React.Fragment>;
                })}
            </QuizGridWrapper>
        </QuizWrapper>
    );
};

const QuizWrapper = styled('div')({
    padding: '2vw',
});

const QuizGridWrapper = styled('div')(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    color: 'white',

    display: 'grid',
    gridTemplate: '100px repeat(5, 120px) / repeat(6, 1fr)',
    gridAutoFlow: 'column',
    gap: '2px',
    border: `2px solid ${theme.palette.primary.main}`,

    boxSizing: 'border-box',
}));

export default QuizGrid;
