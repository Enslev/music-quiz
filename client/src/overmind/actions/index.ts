import { Context } from '..';

const localStorage = window.localStorage;

export const onInitializeOvermind = async ({
    state,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effects,
}: Context) => {
    state.spotifyAccessToken = localStorage.getItem('spotifyAccessToken');
    state.spotifyRefreshToken = localStorage.getItem('spotifyRefreshToken');
};

export * as auth from './auth';
