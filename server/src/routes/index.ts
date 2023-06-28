import { Router } from 'express';
import { healthRoutes } from './controllers/health';
import { authRoutes } from './controllers/auth';
import { quizzesRoutes } from './controllers/quizzes';
import { spotifyRoutes } from './controllers/spotify';
import { sessionRoutes } from './controllers/sessions';

const routes = Router();

routes.use('/health', healthRoutes);
routes.use('/auth', authRoutes);
routes.use('/spotify', spotifyRoutes);
routes.use('/quizzes', quizzesRoutes);
routes.use('/sessions', sessionRoutes);

export {
    routes,
};
