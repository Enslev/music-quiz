import { Context } from '../..';
import request, { ErrorResponse } from '../../../services/api-service';
import jwt from 'jwt-decode';
import { Token } from '../auth';
import { hasProp } from '../../../services/utils';
import { SearchSpotifyResponseBody, TrackFromSpotify } from './types';

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

interface PlayPayload {
    trackUri: string;
    position?: number;
}
export const play = async (context: Context, payload: PlayPayload) => {
    const {
        trackUri,
        position = 0,
    } = payload;

    const { state } = context;

    if (state.spotifyPlayer.currentlyPlaying == trackUri) {
        return resume(context);
    }

    // Update state
    state.spotifyPlayer.isPlaying = true;
    state.spotifyPlayer.currentlyPlaying = trackUri;
    localStorage.setItem('currentlyPlaying', trackUri);

    const body: {
        uris: string[],
        position_ms?: number,
    } = {
        uris: [trackUri],
    };

    if (position > 0) {
        body.position_ms = position;
    }

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: 'a2fbc6475d5078c9725986d4804dfff78b3f30da',
        },
        body,
    };
    return spotifyWrapper(context, 'me/player/play', options);
};

export const resume = async (context: Context) => {
    // Update state
    context.state.spotifyPlayer.isPlaying = true;

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: 'a2fbc6475d5078c9725986d4804dfff78b3f30da',
        },
    };
    return spotifyWrapper(context, 'me/player/play', options);
};

export const pause = async (context: Context) => {
    // Update state
    context.state.spotifyPlayer.isPlaying = false;

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: 'a2fbc6475d5078c9725986d4804dfff78b3f30da',
        },
    };
    return spotifyWrapper(context, 'me/player/pause', options);
};

export const stop = async (context: Context) => {
    // Update state
    context.state.spotifyPlayer.currentlyPlaying = null;
    context.state.spotifyPlayer.isPlaying = false;
    localStorage.removeItem('currentlyPlaying');

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: 'a2fbc6475d5078c9725986d4804dfff78b3f30da',
        },
    };
    return spotifyWrapper(context, 'me/player/pause', options);
};

export const getTrack = async (context: Context, trackUri: string) => {

    const options: spotifyWrapperOptions = {
        method: 'GET',
    };

    return spotifyProxyWrapper<TrackFromSpotify>(context, `tracks/${trackUri}`, options);
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

const spotifyProxyWrapper = async <T>(context: Context, path: string, options: spotifyWrapperOptions, retry = 2): Promise<T | null> => {
    const { state, actions } = context;
    if (!state.token) return null;

    try {
        switch (options.method) {
        case ('GET'): {
            return await request.get<T>(`http://localhost:9001/api/spotify/${path}`, {
                headers: { authorization: `Bearer ${context.state.token}` },
                query: options.query ?? null,
            });
        }
        case ('PUT'): {
            return await request.put<T>(`http://localhost:9001/api/spotify/${path}`, {
                headers: { authorization: `Bearer ${context.state.token}` },
                query: options.query ?? null,
                body: options.body,
            });
        }
        }
    } catch(err) {
        if (hasProp(err, 'error')) {
            const httpError = err.error as ErrorResponse;

            if (httpError.status == 401 && httpError.message == 'The access token expired') {
                if (retry == 0) throw Error('Max retries exceeded');

                await actions.auth.refreshAccessToken();
                return await spotifyProxyWrapper<T>(context, path, options, retry-1);
            }
        }
        console.log('Something went really wrong with request', err);
        return null;
    }
};
