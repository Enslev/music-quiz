import { Context } from ".."

const localStorage = window.localStorage;

export const onInitializeOvermind = async ({
    state,
    actions,
    effects
}: Context) => {
    state.spotifyAccessToken = localStorage.getItem('spotifyAccessToken');
    state.spotifyRefreshToken = localStorage.getItem('spotifyRefreshToken');
}

export * as auth from './auth'
