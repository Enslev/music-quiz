import { Context } from '..';

const localStorage = window.localStorage;

export const onInitializeOvermind = async ({
    state,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effects,
}: Context) => {
    state.token = localStorage.getItem('token');
    state.spotifyPlayer.currentlyPlaying = localStorage.getItem('currentlyPlaying');

    actions.auth.updateEffectsApiKey();
    if (state.isLoggedIn) {
        await actions.spotify.initSpotifyValues();
    }
};

export * as auth from './auth';

export * as quiz from './quizzes';
export * as sessions from './sessions';
export * as spotify from './spotify';
export * as ui from './ui';
