import { Context } from '..';
import { ExchangeCodeRequest, ExchangeCodeResponse } from '../../../../shared/api-models/spotify';
import { request } from '../../services/api-service';

export const loginWithCode = async ({ state }: Context, code: string) => {
    const requestBody: ExchangeCodeRequest = { code };
    const codeExhangeResponse = await request<ExchangeCodeResponse>('http://localhost:9001/api/spotify/code', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(requestBody),
    });

    state.spotifyAccessToken = codeExhangeResponse.access_token;
    state.spotifyRefreshToken = codeExhangeResponse.refresh_token;

    localStorage.setItem('spotifyAccessToken', state.spotifyAccessToken);
    localStorage.setItem('spotifyRefreshToken', state.spotifyRefreshToken);
};

export const logout = ({ state }: Context) => {
    state.spotifyAccessToken = null;
    state.spotifyRefreshToken = null;
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyRefreshToken');
};
