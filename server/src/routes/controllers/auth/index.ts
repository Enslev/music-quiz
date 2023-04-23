import { Router } from 'express';
import { redirect, exchangeCode, refreshAccessToken } from './controller';
import { authMiddleware } from '../../../services/auth';

const router = Router({ mergeParams: true });

router.get('/redirect', redirect);
router.post('/code', exchangeCode);
router.post('/refresh', authMiddleware, refreshAccessToken);

export default router;
