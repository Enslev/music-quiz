import { Router } from 'express';
import HealthRoute from './controllers/health';
import AuthRoute from './controllers/auth';
import QuizRoutes from './controllers/quiz';

const router = Router({ mergeParams: true });

router.use('/health', HealthRoute);
router.use('/auth', AuthRoute);
router.use('/quiz', QuizRoutes);

export default router;

