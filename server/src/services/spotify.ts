import got from 'got';

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
}

export const exchangeCode = async (code: string) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    const response = await got.post<SpotifyAccessTokenResponse>('https://accounts.spotify.com/api/token', {
        form: {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirectUri,
            'client_secret': clientSecret,
            'client_id': clientId,
        },
        responseType: 'json',
    });

    return response.body;
};

export const getUserInformation = async (accessToken: string) => {
    const response = await got.get<UserInformationResponse>('https://api.spotify.com/v1/me', {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        responseType: 'json',
    });
    return response;
};
