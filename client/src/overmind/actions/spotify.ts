import { Context } from '..';
import { ErrorResponse } from '../../services/api.service';
import { hasProp } from '../../services/utils';
import { SpotiyDeviceObject } from '../effects/api/spotify/types';

let playbackUpdateInterval: NodeJS.Timer | null = null;
const PLAYBACK_UPDATE_INTERVAL_MS = 900 as const;

const startPlaybackUpdates = (context: Context) => {
    if (playbackUpdateInterval) clearInterval(playbackUpdateInterval);

    const { updatePlaybackState } = context.actions.spotify;

    playbackUpdateInterval = setInterval(async () => {
        updatePlaybackState();
    }, PLAYBACK_UPDATE_INTERVAL_MS);
};

const stopPlaybackUpdates = () => {
    if (!playbackUpdateInterval) return;
    clearInterval(playbackUpdateInterval);
};

export const initSpotifyValues = async (context: Context) => {
    // Try finding active spotify session
    const availableDevices = await context.actions.spotify.getAvailableDevices();
    context.state.selectedDevice = availableDevices.find((device) => device.is_active) ?? null;
};

export const updatePlaybackState = async (context: Context) => {
    const playbackResponse = await getPlaybackState(context);
    context.state.spotifyPlayer.playpackPosition = playbackResponse?.progress_ms ?? null;

    // If spotify is not playing, stop these updates
    if (!(playbackResponse?.is_playing ?? true)) {
        stopPlaybackUpdates();

        if (context.state.spotifyPlayer.isPlaying) {
            context.actions.spotify.clearState();
        }
    }
};

export const search = async (context: Context, searchTerm: string) => {
    return spotifyWrapper(context,
        () => context.effects.api.spotify.searchSpotify(searchTerm),
    );
};

interface playOptions {
    trackUri: string;
    position?: number;
}
export const play = async (context: Context, options: playOptions) => {
    const {
        trackUri,
        position = 0,
    } = options;

    const { state, effects } = context;

    const selectedDevice = state.selectedDevice;
    if (!selectedDevice) return;

    if (state.spotifyPlayer.currentlyPlaying == trackUri) {
        return resume(context);
    }

    await spotifyWrapper(context,
        () => effects.api.spotify.play(selectedDevice.id, {
            uris: [ trackUri ],
            position_ms: position,
        }),
    );

    // Update state
    startPlaybackUpdates(context);
    state.spotifyPlayer.isPlaying = true;
    state.spotifyPlayer.currentlyPlaying = trackUri;
    localStorage.setItem('currentlyPlaying', trackUri);

};

export const resume = async (context: Context) => {
    const { effects, state } = context;

    const selectedDevice = state.selectedDevice;
    if (!selectedDevice) return;

    // Update state
    startPlaybackUpdates(context);
    context.state.spotifyPlayer.isPlaying = true;

    return spotifyWrapper(context,
        () => effects.api.spotify.play(selectedDevice.id),
    );
};

export const seek = async (context: Context, newPosition: number) => {
    const { effects, state } = context;

    const selectedDevice = state.selectedDevice;
    if (!selectedDevice) return;

    return spotifyWrapper(context,
        () => effects.api.spotify.seek(selectedDevice.id, newPosition),
    );
};

export const pause = async (context: Context) => {
    const { effects, state } = context;

    const selectedDevice = state.selectedDevice;
    if (!selectedDevice) return;

    const spotifyState = state.spotifyPlayer;
    const isPlayingBeforeUpdate = state.spotifyPlayer.isPlaying;

    // Update state
    stopPlaybackUpdates();
    spotifyState.isPlaying = false;

    // Don't notify spotify if there is no song playing
    if (!isPlayingBeforeUpdate) return;

    return spotifyWrapper(context,
        () => effects.api.spotify.pause(selectedDevice.id),
    );
};

export const stop = async (context: Context) => {
    const { effects, state, actions } = context;

    const selectedDevice = state.selectedDevice;
    if (!selectedDevice) return;

    const spotifyState = state.spotifyPlayer;
    const isPlayingBeforeUpdate = spotifyState.isPlaying;

    actions.spotify.clearState();

    // Don't notify spotify if there is no song playing
    if (!isPlayingBeforeUpdate) return;

    return spotifyWrapper(context,
        () => effects.api.spotify.pause(selectedDevice.id),
    );
};

export const clearState = async (context: Context) => {
    const { state } = context;
    const spotifyState = state.spotifyPlayer;

    stopPlaybackUpdates();
    spotifyState.currentlyPlaying = null;
    spotifyState.isPlaying = false;
    spotifyState.playpackPosition = null;
    localStorage.removeItem('currentlyPlaying');
};

export const getPlaybackState = async (context: Context) => {
    const { effects } = context;

    return spotifyWrapper(context,
        () => effects.api.spotify.getPlaybackState(),
    );
};

export const getTrack = async (context: Context, trackUri: string) => {
    const { effects } = context;

    return spotifyProxyWrapper(context,
        () => effects.api.spotify.getTrack(trackUri),
    );
};

export const getAvailableDevices = async (context: Context) => {
    const { effects } = context;

    const response = await spotifyWrapper(context,
        () => effects.api.spotify.getAvailableDevices(),
    );

    return response?.devices ?? [];
};

export const setSelectedDevice = async ({ state }: Context, device: SpotiyDeviceObject) => {
    state.selectedDevice = device;
};

const spotifyWrapper = async <T>(context: Context, request: () => T): Promise<T | null> => {
    const { actions } = context;

    try {
        return await request();
    } catch(err) {
        if (hasProp(err, 'message')) {
            const httpError = err as ErrorResponse;

            if (httpError.status == 401 && httpError.message == 'The access token expired') {
                await actions.auth.refreshAccessToken();
                return await spotifyWrapper<T>(context, request);
            }
        }
        console.log('Something went really wrong with request', err);
        return null;
    }
};

const spotifyProxyWrapper = async <T>(context: Context, request: () => T): Promise<T | null> => {
    const { actions } = context;

    try {
        return await request();
    } catch(err) {
        if (err == 'Unauthorized') {
            await actions.auth.refreshAccessToken();
            return await spotifyProxyWrapper<T>(context, request);
        }
        console.log('Something went really wrong with request', err);
        return null;
    }
};
