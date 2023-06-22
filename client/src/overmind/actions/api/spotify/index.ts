import { Context } from '../../..';
import request, { ErrorResponse } from '../../../../services/api-service';
import jwt from 'jwt-decode';
import { Token } from '../../auth';
import { hasProp } from '../../../../services/utils';
import { SearchSpotifyResponseBody, GetPlaybackStateResponseBody, SpotifyTrackObject } from './types';

const deviceID = 'df29db6cb8652085b5395dae088370700b12aff0'; // TODO Make this not hardcoded
let playbackUpdateInterval: NodeJS.Timer | null = null;
const PLAYBACK_UPDATE_INTERVAL_MS = 900 as const;

const startPlaybackUpdates = (context: Context) => {
    const { updatePlaybackPosition } = context.actions.api.spotify;
    playbackUpdateInterval = setInterval(async () => {
        updatePlaybackPosition();
    }, PLAYBACK_UPDATE_INTERVAL_MS);
};

const stopPlaybackUpdates = () => {
    if (!playbackUpdateInterval) return;
    clearInterval(playbackUpdateInterval);
};

export const updatePlaybackPosition = async (context: Context) => {
    const playbackResponse = await getPlaybackState(context);
    context.state.spotifyPlayer.playpackPosition = playbackResponse?.progress_ms ?? null;
};

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
    startPlaybackUpdates(context);
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
            device_id: deviceID,
        },
        body,
    };
    return spotifyWrapper(context, 'me/player/play', options);
};

export const resume = async (context: Context) => {
    // Update state
    startPlaybackUpdates(context);
    context.state.spotifyPlayer.isPlaying = true;

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: deviceID,
        },
    };
    return spotifyWrapper(context, 'me/player/play', options);
};

export const seek = async (context: Context, newPosition: number) => {
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            position_ms: newPosition,
            device_id: deviceID,
        },
    };

    return spotifyWrapper(context, 'me/player/seek', options);
};

export const pause = async (context: Context) => {
    const spotifyState = context.state.spotifyPlayer;
    const isPlayingBeforeUpdate = spotifyState.isPlaying;

    // Update state
    stopPlaybackUpdates();
    spotifyState.isPlaying = false;

    // Don't notify spotify if there is no song playing
    if (!isPlayingBeforeUpdate) return;

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: deviceID,
        },
    };
    return spotifyWrapper(context, 'me/player/pause', options);
};

export const stop = async (context: Context) => {
    const spotifyState = context.state.spotifyPlayer;
    const isPlayingBeforeUpdate = spotifyState.isPlaying;

    // Update state
    stopPlaybackUpdates();
    spotifyState.currentlyPlaying = null;
    spotifyState.isPlaying = false;
    spotifyState.playpackPosition = null;
    localStorage.removeItem('currentlyPlaying');

    // Don't notify spotify if there is no song playing
    if (!isPlayingBeforeUpdate) return;

    // Trigger spotify API
    const options: spotifyWrapperOptions = {
        method: 'PUT',
        query: {
            device_id: deviceID,
        },
    };
    return spotifyWrapper(context, 'me/player/pause', options);
};

export const getPlaybackState = async (context: Context) => {

    const options: spotifyWrapperOptions = {
        method: 'GET',
        query: {
            market: 'DK',
        },
    };

    return spotifyWrapper<GetPlaybackStateResponseBody>(context, 'me/player', options);
};

export const getTrack = async (context: Context, trackUri: string) => {

    const options: spotifyWrapperOptions = {
        method: 'GET',
    };

    return spotifyProxyWrapper<SpotifyTrackObject>(context, `tracks/${trackUri}`, options);
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
        if (err == 'Unauthorized') {
            await actions.auth.refreshAccessToken();
            return await spotifyProxyWrapper<T>(context, path, options, retry-1);
        }
        console.log('Something went really wrong with request', err);
        return null;
    }
};
