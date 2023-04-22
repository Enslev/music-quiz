import { Context } from '../..';
import request from '../../../services/api-service';
import { createQuizRequestBody, putQuizRequestBody } from './types';

export interface Quiz {
    _id: string;
    title: string;
    user: string;
    categories: {
        _id: string;
        title: string;
        tracks: {
            _id: string;
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

export const createQuiz = async ({ state }: Context, body: createQuizRequestBody) => {
    const response = await request.post<Quiz>('http://localhost:9001/api/quiz', {
        headers: { authorization: `Bearer ${state.token}` },
        body,
    });

    return response;
};


export const putQuiz = async ({ state }: Context, body: putQuizRequestBody) => {
    const response = await request.put<Quiz>(`http://localhost:9001/api/quiz/${body._id}`, {
        headers: { authorization: `Bearer ${state.token}` },
        body,
    });

    return response;
};
