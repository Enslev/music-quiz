import { Mutex } from 'async-mutex';
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

const refreshTokenMutex = new Mutex();
export const refreshAccessToken = async ({ state, effects, actions }: Context) => {
    if (!state.token) return;

    if (refreshTokenMutex.isLocked()) {
        console.log('Refresh is already in progress');
        await refreshTokenMutex.waitForUnlock();
        return;
    }

    await refreshTokenMutex.acquire();
    console.log('Refresh mutex aquired - Refreshing token');

    const { refreshToken } = jwt<Token>(state.token);
    const newToken = await effects.api.auth.refreshSpotifyToken(refreshToken);

    state.token = newToken;
    localStorage.setItem('token', newToken);

    actions.auth.updateEffectsApiKey();
    refreshTokenMutex.release();
};

export const logout = ({ state }: Context) => {
    state.token = null;
    localStorage.removeItem('token');
};

export const updateEffectsApiKey = ({ state, effects }: Context) => {
    const token = state.token;
    if (!token) return;

    const updateAuthMethods = Object.values(effects.api).map((api) => api.updateAuth);
    updateAuthMethods.forEach((updateAuthMethod) => updateAuthMethod(token));
};
