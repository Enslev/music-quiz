import { Request, Response } from 'express';
import querystring from 'querystring';
import { v4 as uuid } from 'uuid'
import got from 'got';

import { ExchangeCodeReqBody, SpotifyAccessTokenResponse } from './model.js';


const clientId = '823cda687c814b84a624acbaef2995ee';
const clientSecret = 'ce46053c35ea48988d5075cffa770384';
const redirectUri = 'http://localhost:3000/auth/callback'

export const redirect = (req: Request, res: Response) => {
    const state = uuid();;
    const scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    }));
}

export const exchangeCode = async (req: Request<{}, {}, ExchangeCodeReqBody>, res: Response) => {
    const code = req.body.code;
    const response = await got.post<SpotifyAccessTokenResponse>('https://accounts.spotify.com/api/token', {
        form: {
            'grant_type':    'authorization_code',
            'code':          code,
            'redirect_uri':  redirectUri,
            'client_secret': clientSecret,
            'client_id':     clientId,
          },
          responseType: 'json',
    });

    res.status(200).send(response.body);
}
