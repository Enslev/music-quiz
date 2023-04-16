import { Router } from 'express';
import { redirect, exchangeCode } from './controller';

const router = Router({ mergeParams: true });

router.get('/auth', redirect);
router.post('/code', exchangeCode);

export default router;
