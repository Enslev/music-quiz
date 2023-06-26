import { Context } from '..';
import request from '../../services/api-service';
import jwt from 'jwt-decode';

interface ExchangeCodeResponse {
    token: string;
}

export interface Token {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export const loginWithCode = async ({ state }: Context, code: string) => {
    const codeExhangeResponse = await request
        .post<ExchangeCodeResponse>(`${state.apiUrl}/api/auth/code`, {
            body: { code },
        });

    state.token = codeExhangeResponse.token;

    localStorage.setItem('token', state.token);
};

export const refreshAccessToken = async ({ state }: Context) => {
    console.log('refreshing token');
    if (!state.token) return;

    const { refreshToken } = jwt<Token>(state.token);

    const codeExhangeResponse = await request
        .post<ExchangeCodeResponse>(`${state.apiUrl}/api/auth/refresh`, {
            headers: { authorization: `Bearer ${state.token}` },
            body: {
                code: refreshToken,
            },
        });

    state.token = codeExhangeResponse.token;

    localStorage.setItem('token', state.token);
};

export const logout = ({ state }: Context) => {
    state.token = null;
    localStorage.removeItem('token');
};
