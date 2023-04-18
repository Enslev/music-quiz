import { Router } from 'express';
import { redirect, exchangeCode } from './controller';

const router = Router({ mergeParams: true });

router.get('/redirect', redirect);
router.post('/code', exchangeCode);

export default router;
