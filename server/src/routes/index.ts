import { Router } from 'express';
import HealthRoute from './controllers/health';
import AuthRoute from './controllers/auth';
import QuizRoutes from './controllers/quiz';
import SpotifyRoutes from './controllers/spotify';

const router = Router({ mergeParams: true });

router.use('/health', HealthRoute);
router.use('/auth', AuthRoute);
router.use('/quiz', QuizRoutes);
router.use('/spotify', SpotifyRoutes);

export default router;

