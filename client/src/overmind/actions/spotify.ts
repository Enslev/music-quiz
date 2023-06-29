import { Context } from '..';
import { ErrorResponse } from '../../services/api-service';
import { hasProp } from '../../services/utils';

const deviceId = 'df29db6cb8652085b5395dae088370700b12aff0'; // TODO Make this not hardcoded
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

    if (state.spotifyPlayer.currentlyPlaying == trackUri) {
        return resume(context);
    }

    await spotifyWrapper(context,
        () => effects.api.spotify.play(deviceId, {
            uris: [trackUri],
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
    const { effects } = context;

    // Update state
    startPlaybackUpdates(context);
    context.state.spotifyPlayer.isPlaying = true;

    return spotifyWrapper(context,
        () => effects.api.spotify.play(deviceId),
    );
};

export const seek = async (context: Context, newPosition: number) => {
    const { effects } = context;

    return spotifyWrapper(context,
        () => effects.api.spotify.seek(deviceId, newPosition),
    );
};

export const pause = async (context: Context) => {
    const { effects, state } = context;

    const spotifyState = state.spotifyPlayer;
    const isPlayingBeforeUpdate = state.spotifyPlayer.isPlaying;

    // Update state
    stopPlaybackUpdates();
    spotifyState.isPlaying = false;

    // Don't notify spotify if there is no song playing
    if (!isPlayingBeforeUpdate) return;

    return spotifyWrapper(context,
        () => effects.api.spotify.pause(deviceId),
    );
};

export const stop = async (context: Context) => {
    const { effects, state, actions } = context;

    const spotifyState = state.spotifyPlayer;
    const isPlayingBeforeUpdate = spotifyState.isPlaying;

    actions.spotify.clearState();

    // Don't notify spotify if there is no song playing
    if (!isPlayingBeforeUpdate) return;

    return spotifyWrapper(context,
        () => effects.api.spotify.pause(deviceId),
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

const spotifyWrapper = async <T>(context: Context, request: () => T): Promise<T | null> => {
    const { actions } = context;

    try {
        return await request();
    } catch(err) {
        if (hasProp(err, 'message')) {
            const httpError = err as ErrorResponse;

            if (httpError.status == 401 && httpError.message == 'The access token expired') {
                console.log('Need to refresh');
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
