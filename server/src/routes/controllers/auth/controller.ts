import { Request, Response } from 'express';
import querystring from 'querystring';
import { v4 as uuid } from 'uuid';

import * as spotify from '../../../services/spotify';
import { UserModel } from '../../../mongoose/User';
import { signJWT } from '../../../services/auth';

const spotifyScopes = [
    'user-read-private',
    'user-read-email',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
];

export const redirect = (req: Request, res: Response) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    const state = uuid();
    const scope = spotifyScopes.join(' ');
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state,
        }));
};

export const exchangeCode = async (req: Request, res: Response) => {
    const code = req.body.code;
    const exhangeResponse = await spotify.exchangeCode(code);
    const userInfo = await spotify.getUserInformation(exhangeResponse.access_token);

    let user = await UserModel.findOne({ spotifyKey: userInfo.id });
    if (!user) {
        user = await UserModel.create({
            name: userInfo.display_name,
            spotifyKey: userInfo.id,
            email: userInfo.email,
            spotifyUri: userInfo.uri,
            country: userInfo.country,
        });

        await user.save();
    }


    const JWTContent = {
        accessToken: exhangeResponse.access_token,
        refreshToken: exhangeResponse.refresh_token,
        userId: user.id,
    };

    res.status(200).send({
        token: signJWT(JWTContent),
    });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
    const code = req.body.code;
    const exhangeResponse = await spotify.exchangeRefreshToken(code);

    console.log('exhangeResponse', exhangeResponse);

    const JWTContent = {
        accessToken: exhangeResponse.access_token,
        refreshToken: code,
        userId: req.user._id.toString(),
    };

    res.status(200).send({
        token: signJWT(JWTContent),
    });
};
