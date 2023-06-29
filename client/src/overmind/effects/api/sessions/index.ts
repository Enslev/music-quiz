import { API_URL } from '../../utils';
import request from '../../../../services/api-service';
import { Session, CreateSessionRequestBody, CreateTeamRequestBody, PutTeamRequestBody } from './types';

export const sessions = (() => {
    let apiToken: string;
    const baseUrl = `${API_URL}/api/sessions`;

    return {
        updateAuth: (newToken: string) => {
            apiToken = newToken;
        },

        PostSession: async (body: CreateSessionRequestBody) => {
            return await request.post<Session>(baseUrl, {
                headers: { authorization: `Bearer ${apiToken}` },
                body,
            });
        },

        getSession: async (sessionCode: string) => {
            return await request.get<Session>(`${baseUrl}/${sessionCode}`);
        },

        postTeam: async (sessionId: string, body: CreateTeamRequestBody) => {
            return await request.post<Session>(`${baseUrl}/${sessionId}/teams`, {
                headers: { authorization: `Bearer ${apiToken}` },
                body,
            });
        },

        putTeam: async (sessionId: string, body: PutTeamRequestBody) => {
            return await request.put<Session>(`${baseUrl}/${sessionId}/teams/${body._id}`, {
                headers: { authorization: `Bearer ${apiToken}` },
                body,
            });
        },

        deleteTeam: async (sessionId: string, teamId: string) => {
            return await request.delete<Session>(`${baseUrl}/${sessionId}/teams/${teamId}`, {
                headers: { authorization: `Bearer ${apiToken}` },
            });
        },
    };
})();
