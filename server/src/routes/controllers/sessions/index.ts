import { Router } from 'express';
import { createSession, getSessions } from './controller';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';
import { createSessionSchema, getSessionSchema } from './schema';

const sessionRoutes = Router();

sessionRoutes.post('/', customValidator(createSessionSchema), authMiddleware, createSession);
sessionRoutes.get('/:sessionCode', customValidator(getSessionSchema), getSessions);

export { sessionRoutes };
