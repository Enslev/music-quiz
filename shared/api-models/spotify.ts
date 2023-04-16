export type ExchangeCodeRequest = {
    code: string;
}

export type ExchangeCodeResponse = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
}
