import { Context } from '../../..';
import request from '../../../../services/api-service';
import { Quiz, createQuizRequestBody, putQuizRequestBody } from './types';

export type Category = Quiz['categories'][number];
export type Track = Quiz['categories'][number]['tracks'][number];

export const getQuizzes = async ({ state }: Context) => {

    const response = await request.get<Quiz[]>(`${state.apiUrl}/api/quiz`, {
        headers: { authorization: `Bearer ${state.token}` },
        // query: { populate: 'user' },
    });

    return response;
};

export const getQuiz = async ({ state }: Context, quizId: string) => {
    const response = await request.get<Quiz>(`${state.apiUrl}/api/quiz/${quizId}`, {
        headers: { authorization: `Bearer ${state.token}` },
    });

    return response;
};

export const createQuiz = async ({ state }: Context, body: createQuizRequestBody) => {
    const response = await request.post<Quiz>(`${state.apiUrl}/api/quiz`, {
        headers: { authorization: `Bearer ${state.token}` },
        body,
    });

    return response;
};


export const putQuiz = async ({ state }: Context, body: putQuizRequestBody) => {
    const response = await request.put<Quiz>(`${state.apiUrl}/api/quiz/${body._id}`, {
        headers: { authorization: `Bearer ${state.token}` },
        body,
    });

    return response;
};
