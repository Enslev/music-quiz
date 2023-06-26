import request from '../../../../services/api-service';
import { Context } from '../../..';
import { Session, createSessionRequestBody } from './types';


export const createQuiz = async ({ state }: Context, body: createSessionRequestBody) => {
    const response = await request.post<Session>(`${state.apiUrl}/api/sessions`, {
        headers: { authorization: `Bearer ${state.token}` },
        body,
    });

    return response;
};
