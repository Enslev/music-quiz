import { Router } from 'express';
import HealthRoute from './controllers/health';
import SpotifyRoute from './controllers/spotify';
import QuizRoutes from './controllers/quiz';
import { Express } from 'express';

const router = Router({ mergeParams: true });

router.use('/health', HealthRoute);
router.use('/spotify', SpotifyRoute);
router.use('/quiz', QuizRoutes);

export default router;

