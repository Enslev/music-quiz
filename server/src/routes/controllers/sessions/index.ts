import { Router } from 'express';
import { createSession, createTeam, getSessions } from './controller';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';
import { createSessionSchema, createTeamSchema, getSessionSchema } from './schema';

const sessionRoutes = Router();

sessionRoutes.post('/', customValidator(createSessionSchema), authMiddleware, createSession);
sessionRoutes.get('/:sessionCode', customValidator(getSessionSchema), getSessions);

sessionRoutes.post('/:sessionId/teams', customValidator(createTeamSchema), createTeam);

export { sessionRoutes };
