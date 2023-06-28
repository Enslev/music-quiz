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
    actions.auth.updateEffectsApiKey();
    state.spotifyPlayer.currentlyPlaying = localStorage.getItem('currentlyPlaying');
};

export * as auth from './auth';

export * as quiz from './quizzes';
export *  as sessions from './sessions';
export * as spotify from './spotify';
