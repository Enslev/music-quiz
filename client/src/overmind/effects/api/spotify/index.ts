import jwt from 'jwt-decode';
import { API_URL } from '../../utils';
import { GetAvailableDevicesResponseBody, GetPlaybackStateResponseBody, PlayRequestBody, SearchSpotifyResponseBody, SpotifyTrackObject } from './types';
import request from '../../../../services/api.service';
import { Token } from '../../../actions/auth';


export const spotify = (() => {
    let apiToken: string;
    let spotifyAccessToken: string;
    const baseUrl = `${API_URL}/api/spotify`;

    return {
        updateAuth: (newToken: string) => {
            apiToken = newToken;
            spotifyAccessToken = jwt<Token>(newToken).accessToken;
        },

        searchSpotify: async (searchTerm: string) => {
            return await request.get<SearchSpotifyResponseBody>('https://api.spotify.com/v1/search', {
                headers: { authorization: `Bearer ${spotifyAccessToken}` },
                query: {
                    q: searchTerm,
                    type: 'track',
                    market: 'DK',
                    limit: 10,
                },
            });
        },

        play: async (deviceId: string, payload?: PlayRequestBody) => {
            return await request.put<unknown>('https://api.spotify.com/v1/me/player/play', {
                headers: { authorization: `Bearer ${spotifyAccessToken}` },
                query: { device_id: deviceId },
                body: payload ?? {},
            });
        },

        pause: async (deviceId: string) => {
            return await request.put<unknown>('https://api.spotify.com/v1/me/player/pause', {
                headers: { authorization: `Bearer ${spotifyAccessToken}` },
                query: { device_id: deviceId },
            });
        },

        seek: async (deviceId: string, newPositionMs: number) => {
            return await request.put<unknown>('https://api.spotify.com/v1/me/player/seek', {
                headers: { authorization: `Bearer ${spotifyAccessToken}` },
                query: {
                    device_id: deviceId,
                    position_ms: newPositionMs,
                },
            });
        },

        getPlaybackState: async () => {
            return await request.get<GetPlaybackStateResponseBody>('https://api.spotify.com/v1/me/player', {
                headers: { authorization: `Bearer ${spotifyAccessToken}` },
                query: { market: 'DK' },
            });
        },

        getTrack: async (trackUri: string) => {
            // Notice that this uses our own api, to put a cache between us and spotify
            // This is done because this endpoint is deterministic so are thinking about the rate limit
            return await request.get<SpotifyTrackObject>(`${baseUrl}/tracks/${trackUri}`, {
                headers: { authorization: `Bearer ${apiToken}` },
            });
        },

        getAvailableDevices: async () => {
            return await request.get<GetAvailableDevicesResponseBody>('https://api.spotify.com/v1/me/player/devices', {
                headers: { authorization: `Bearer ${spotifyAccessToken}` },
            });
        },
    };
})();
