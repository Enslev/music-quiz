import { Router } from 'express';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';
import { getTrackJoiSchema } from './schema';
import { getTrack } from './controller';

const spotifyRoutes = Router({ mergeParams: true });

spotifyRoutes.get('/tracks/:trackUri', authMiddleware, customValidator(getTrackJoiSchema), getTrack);

export { spotifyRoutes };
