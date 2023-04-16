import { Router } from 'express';
import HealthRoute from './controllers/health/index.js';
import SpotifyRoute from './controllers/spotify/index.js';

const router = Router();

router.use('/health', HealthRoute);
router.use('/spotify', SpotifyRoute);

export default router;
