import { Request, Response } from 'express';
import querystring from 'querystring';
import { v4 as uuid } from 'uuid';

import { ExchangeCodeRequest, ExchangeCodeResponse } from '../../../../shared/api-models/spotify.js';
import * as spotify from '../../services/spotify.js';
import { User } from '../../services/db-models/user.js';

export const redirect = (req: Request, res: Response) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    const state = uuid();
    const scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state,
        }));
};

export const exchangeCode = async (req: Request<object, object, ExchangeCodeRequest>, res: Response<ExchangeCodeResponse>) => {
    const code = req.body.code;
    const exhangeResposnse = await spotify.exchangeCode(code);
    const userInfo = await spotify.getUserInformation(exhangeResposnse.access_token);

    const newUser = new User({
        spotifyId: userInfo.body.id,
        name: userInfo.body.display_name,
    });

    await newUser.save();

    res.status(200).send(exhangeResposnse);
};
