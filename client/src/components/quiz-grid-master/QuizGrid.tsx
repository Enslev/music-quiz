import React from 'react';
import { Quiz } from '../../overmind/actions/api/quiz';
import { styled } from '@mui/material';
import CategoryBox from './CategoryBox';
import TrackBox from './TrackBox';

interface Props {
    editMode?: boolean;
    revealed?: string[],
    quiz: Quiz | null,
    saveTrigger?: () => void;
}

const QuizGrid: React.FC<Props> = (props) => {

    const {
        quiz,
        revealed,
    } = props;

    if (!quiz) return <></>;

    return (
        <QuizWrapper>
            <QuizGridWrapper>
                {quiz.categories.map((category) => {
                    return <React.Fragment
                        key={category._id}
                    >
                        <CategoryBox
                            category={category}
                        />
                        {category.tracks.map((track) => <TrackBox
                            key={track._id}
                            category={category}
                            track={track}
                            revealed={revealed?.includes(track._id) ?? false}
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

const QuizGridWrapper = styled('div')(({ theme })  => ({
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
