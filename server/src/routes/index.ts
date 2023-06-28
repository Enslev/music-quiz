import { Router } from 'express';
import HealthRoute from './controllers/health';
import AuthRoute from './controllers/auth';
import QuizRoutes from './controllers/quizzes';
import SpotifyRoutes from './controllers/spotify';
import SessionsRoutes from './controllers/sessions';

const router = Router({ mergeParams: true });

router.use('/health', HealthRoute);
router.use('/auth', AuthRoute);
router.use('/quizzes', QuizRoutes);
router.use('/spotify', SpotifyRoutes);
router.use('/sessions', SessionsRoutes);

export default router;

