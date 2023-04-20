import { Context } from '../..';
import request from '../../../services/api-service';

export interface Quiz {
    _id: string;
    title: string;
    user: string;
    categories: {
        title: string;
        tracks: {
            title: string;
            artist: string;
            points:number;
            trackUrl: string;
        }[]
    }[]
}

export const getQuizzes = async ({ state }: Context) => {

    const response = await request.get<Quiz[]>('http://localhost:9001/api/quiz', {
        headers: { authorization: `Bearer ${state.token}` },
        // query: { populate: 'user' },
    });

    return response;
};

export const getQuiz = async ({ state }: Context, quizId: string) => {
    const response = await request.get<Quiz>(`http://localhost:9001/api/quiz/${quizId}`, {
        headers: { authorization: `Bearer ${state.token}` },
    });

    return response;
};
