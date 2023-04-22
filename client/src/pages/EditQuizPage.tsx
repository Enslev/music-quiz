import React from 'react';
import { useParams } from 'react-router-dom';

const EditQuizPage: React.FC = () => {
    const { quizId } = useParams();

    return <>
        <h1>Edit quiz</h1>
        <h2>{quizId}</h2>
    </>;
};

export default EditQuizPage;
