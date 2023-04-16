import { request } from '../../../services/api-service';
import { GetQuizzesResponse } from '../../../../../shared/api-models/quiz';

export const getQuizzes = async () => {
    const response = await request<GetQuizzesResponse>('http://localhost:9001/api/quiz', {
        method: 'GET',
    });

    // response.quizzes.forEach(quiz => quiz.)

    console.log(response);
};
