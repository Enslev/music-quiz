import { Router } from 'express';
import { redirect, exchangeCode, refreshAccessToken } from './controller';
import { authMiddleware } from '../../../services/auth';

const authRoutes = Router();

authRoutes.get('/redirect', redirect);
authRoutes.post('/code', exchangeCode);
authRoutes.post('/refresh', authMiddleware, refreshAccessToken);

export { authRoutes };
