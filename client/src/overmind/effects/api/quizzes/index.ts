import { API_URL } from '../../utils';
import request from '../../../../services/api-service';
import { Quiz, createQuizRequestBody, putQuizRequestBody } from './types';

export const quiz = (() => {
    let apiToken: string;
    const baseUrl = `${API_URL}/api/quizzes`;

    return {
        updateAuth: (newToken: string) => {
            apiToken = newToken;
        },

        getQuizzes: async () => {
            return await request.get<Quiz[]>(baseUrl, {
                headers: { authorization: `Bearer ${apiToken}` },
                // query: { populate: 'user' },
            });
        },

        getQuiz: async (quizId: string) => {
            const response = await request.get<Quiz>(`${baseUrl}/${quizId}`, {
                headers: { authorization: `Bearer ${apiToken}` },
            });

            return response;
        },

        createQuiz: async (body: createQuizRequestBody) => {
            return await request.post<Quiz>(baseUrl, {
                headers: { authorization: `Bearer ${apiToken}` },
                body,
            });
        },

        putQuiz: async (body: putQuizRequestBody) => {
            return await request.put<Quiz>(`${baseUrl}/${body._id}`, {
                headers: { authorization: `Bearer ${apiToken}` },
                body,
            });
        },
    };
})();
