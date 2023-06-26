import request from '../../../../services/api-service';
import { Context } from '../../..';
import { Session, createSessionRequestBody } from './types';


export const createSession = async ({ state }: Context, body: createSessionRequestBody) => {
    const response = await request.post<Session>(`${state.apiUrl}/api/sessions`, {
        headers: { authorization: `Bearer ${state.token}` },
        body,
    });

    return response;
};

export const getSession = async ({ state }: Context, sessionCode: string) => {
    const response = await request.get<Session>(`${state.apiUrl}/api/sessions/${sessionCode}`, {
        headers: { authorization: `Bearer ${state.token}` },
    });

    return response;
};
