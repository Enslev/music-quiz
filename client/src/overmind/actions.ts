import { Context } from "."

const localStorage = window.localStorage;

export const onInitializeOvermind = async ({
    state,
    actions,
    effects
}: Context) => {
    state.spotifyAccessToken = localStorage.getItem('spotifyAccessToken');
    state.spotifyRefreshToken = localStorage.getItem('spotifyRefreshToken');
}

export const login = (({ state }: Context, payload: {
    accessToken: string,
    refreshToken: string
}) => {
    state.spotifyAccessToken = payload.accessToken;
    state.spotifyRefreshToken = payload.refreshToken;
    localStorage.setItem('spotifyAccessToken', state.spotifyAccessToken);
    localStorage.setItem('spotifyRefreshToken', state.spotifyRefreshToken);
});
