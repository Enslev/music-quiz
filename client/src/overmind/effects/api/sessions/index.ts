import { API_URL } from '../../utils';
import request from '../../../../services/api-service';
import { Session, createSessionRequestBody } from './types';

export const sessions = (() => {
    let apiToken: string;
    const baseUrl = `${API_URL}/api/sessions`;

    return {
        updateAuth: (newToken: string) => {
            apiToken = newToken;
        },

        PostSession: async (body: createSessionRequestBody) => {
            return await request.post<Session>(baseUrl, {
                headers: { authorization: `Bearer ${apiToken}` },
                body,
            });
        },

        getSession: async (sessionCode: string) => {
            return await request.get<Session>(`${baseUrl}/${sessionCode}`);
        },
    };
})();
