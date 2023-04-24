import React from 'react';
import { Quiz } from '../../overmind/actions/api/quiz';
import { styled } from '@mui/material';
import CategoryBox from './CategoryBox';
import { noop } from '../../services/utils';
import TrackBox from './TrackBox';

interface Props {
    editMode?: boolean;
    revealed?: string[],
    quiz: Quiz | null,
    saveTrigger?: () => void;
}

const QuizGridComponent: React.FC<Props> = (props) => {

    const {
        quiz,
        revealed,
        saveTrigger,
        editMode = false,
    } = props;

    if (!quiz) return <></>;

    return <QuizWrapper>
        <QuizGrid>
            {quiz.categories.map((category) => {
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
        </QuizGrid>
    </QuizWrapper>;
};

const QuizWrapper = styled('div')({
    padding: '2vw',
});

const QuizGrid = styled('div')(({ theme })  => ({
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

export default QuizGridComponent;
