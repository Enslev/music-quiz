import { Router } from 'express';
import { createSession, getSessions } from './controller';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';
import { createSessionSchema, getSessionSchema } from './schema';

const router = Router({ mergeParams: true });

router.post('/', customValidator(createSessionSchema), authMiddleware, createSession);
router.get('/:sessionCode', customValidator(getSessionSchema), authMiddleware, getSessions);

export default router;
