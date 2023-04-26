import { Response } from 'express';
import { GetTrackSchema } from './schema';
import { ValidatedRequest } from 'express-joi-validation';
import { getTrack as getSpotifyTrack } from '../../../services/spotify';
import * as redis from '../../../services/redis';

export const getTrack = async (req: ValidatedRequest<GetTrackSchema>, res: Response) => {

    const trackUriArr = req.params.trackUri.split(':');

    if (trackUriArr.length != 3) {
        res.status(400).send({
            status: 400,
            message: 'Invalid TrackURi',
        });
        return;
    }

    const [keyType, queryType, trackId] = trackUriArr;

    if (keyType != 'spotify' || queryType != 'track') {
        res.status(400).send({
            status: 400,
            message: 'Invalid TrackURi',
        });
        return;
    }

    const fromCache = await redis.get(trackId);
    if (fromCache) {
        res.status(200).send(fromCache);
        return;
    }

    const spotifyTrack = await getSpotifyTrack(req.spotifyAccessToken, trackId);

    if (spotifyTrack.error?.status == 404) {

        res.status(404).send({
            status: 404,
            message: 'Track not Found',
        });
        return;

    }

    await redis.set(trackId, spotifyTrack);
    res.status(200).send(spotifyTrack);
};
