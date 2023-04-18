import { request } from './request';

interface SpotifyAccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

interface UserInformationResponse {
    country: string;
    display_name: string;
    email: string;
    id: string;
    uri: string;
}

export const exchangeCode = async (code: string): Promise<SpotifyAccessTokenResponse> => {
    const clientId = process.env.SPOTIFY_CLIENT_ID ?? '';
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? '';

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('client_secret', clientSecret);
    params.append('client_id', clientId);

    return await request<SpotifyAccessTokenResponse>('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: params,
    });
};

export const getUserInformation = async (accessToken: string) => {

    const response = request<UserInformationResponse>('https://api.spotify.com/v1/me', {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    });

    return response;
};
