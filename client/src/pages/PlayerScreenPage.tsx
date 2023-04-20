import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useActions } from '../overmind';
import { Quiz } from '../overmind/actions/api/quiz';
import { useParams } from 'react-router-dom';

function PlayerScreenPage() {

    const { quizId } = useParams();
    const { getQuiz } = useActions().api.quiz;
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        (async () => {
            const response = await getQuiz(quizId ?? 'noid');
            setQuiz(response);
            console.log(response);
        })();
    }, []);

    if (!quiz) return <div>loading</div>;

    const categoryList = quiz.categories.map((category, index) => (
        <CategoryContainer key={`${category.title}-${index}`} className='container'>
            <CategoryHeader>{category.title}</CategoryHeader>
            {category.tracks.map((track, trackIndex) => (
                <JeopardyBox key={`${category.title}-${index}-${trackIndex}`}>
                    <span className='points'>{track.points}</span>
                </JeopardyBox>
            ))}
        </CategoryContainer>));

    return <div>
        <CategoryView>{categoryList}</CategoryView>
    </div>;
}


const CategoryView = styled.div`
    display: flex;
    justify-content: center;
`;

const CategoryHeader = styled.div`
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align : center;
    font-weight: 900;
    font-size: 25px;
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

const JeopardyBox = styled.div`
    height: 120px;

    background: rgb(50,102,112);
    background: linear-gradient(135deg, rgba(50,102,112,1) 0%, rgba(45,196,181,1) 100%);

    display: flex;
    justify-content: center;
    align-items: center;
    text-align : center;

    .points {
        font-size: 30px;
    }
`;


export default PlayerScreenPage;
