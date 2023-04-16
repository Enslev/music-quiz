export type ExchangeCodeReqBody = {
    code: string;
}

export type SpotifyAccessTokenResponse = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
}
