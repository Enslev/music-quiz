import { SpotifyAccessTokenResponse, TrackFromSpotify, UserInformationResponse } from '../types/spotify';
import { request } from './request';

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

export const exchangeRefreshToken = async (refreshToken: string): Promise<SpotifyAccessTokenResponse> => {
    const clientId = process.env.SPOTIFY_CLIENT_ID ?? '';
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    return await request<SpotifyAccessTokenResponse>('https://accounts.spotify.com/api/token', {
        headers: { 'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')) },
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

export const getTrack = async (accessToken: string, trackId: string): Promise<TrackFromSpotify> => {

    const response = request<TrackFromSpotify>(`https://api.spotify.com/v1/tracks/${trackId}?market=DK`, {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    });

    return response;
};
