import { Router } from 'express';
import { redirect, exchangeCode } from './controller.js';

const router = Router();

router.get('/auth', redirect);
router.post('/code', exchangeCode);

export default router;
