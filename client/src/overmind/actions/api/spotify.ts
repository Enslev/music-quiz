import { Context } from '../..';
import request, { ErrorResponse } from '../../../services/api-service';
import jwt from 'jwt-decode';
import { Token } from '../auth';
import { hasProp } from '../../../services/utils';
import { SearchSpotifyResponseBody } from './types';

export const search = async (context: Context, searchTerm: string): Promise<SearchSpotifyResponseBody | null> => {
    return spotifyWrapper<SearchSpotifyResponseBody>(context, 'search', {
        method: 'GET',
        query: {
            q: searchTerm,
            type: 'track',
            market: 'DK',
            limit: 10,
        },
    });
};

export const play = async (context: Context, trackUri: string) => {
    // Update state
    context.state.spotifyPlayer.currentlyPlaying = trackUri;
    localStorage.setItem('currentlyPlaying', trackUri);

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: 'a2fbc6475d5078c9725986d4804dfff78b3f30da',
        },
        body: {
            uris: [trackUri],
        },
    };
    return spotifyWrapper(context, 'me/player/play', options);
};
export const pause = async (context: Context) => {
    // Update state
    context.state.spotifyPlayer.currentlyPlaying = null;

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: 'a2fbc6475d5078c9725986d4804dfff78b3f30da',
        },
    };
    return spotifyWrapper(context, 'me/player/pause', options);
};


interface spotifyWrapperOptions {
    method: 'GET' | 'PUT';
    query?: {[key: string]: string | number;};
    body?: object;
}
const spotifyWrapper = async <T>(context: Context, path: string, options: spotifyWrapperOptions): Promise<T | null> => {
    const { state, actions } = context;
    if (!state.token) return null;

    const { accessToken } = jwt<Token>(state.token);

    try {
        switch (options.method) {
        case ('GET'): {
            return await request.get<T>(`https://api.spotify.com/v1/${path}`, {
                headers: { authorization: `Bearer ${accessToken}` },
                query: options.query ?? {},
            });
        }
        case ('PUT'): {
            return await request.put<T>(`https://api.spotify.com/v1/${path}`, {
                headers: { authorization: `Bearer ${accessToken}` },
                query: options.query ?? {},
                body: options.body,
            });
        }
        }
    } catch(err) {
        if (hasProp(err, 'message')) {
            const httpError = err as ErrorResponse;

            if (httpError.status == 401 && httpError.message == 'The access token expired') {
                console.log('Need to refresh');
                await actions.auth.refreshAccessToken();
                return await spotifyWrapper<T>(context, path, options);
            }
        }
        console.log('Something went really wrong with request', err);
        return null;
    }
};
