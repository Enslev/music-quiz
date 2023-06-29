import { Router } from 'express';
import { createSession, createTeam, deleteTeam, getSessions, putTeam } from './controller';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';
import { createSessionSchema, createTeamSchema, deleteTeamSchema, getSessionSchema, putTeamSchema } from './schema';

const sessionRoutes = Router();

sessionRoutes.post('/', customValidator(createSessionSchema), authMiddleware, createSession);
sessionRoutes.get('/:sessionCode', customValidator(getSessionSchema), getSessions);

sessionRoutes.post('/:sessionId/teams', customValidator(createTeamSchema), createTeam);
sessionRoutes.put('/:sessionId/teams/:teamId', customValidator(putTeamSchema), putTeam);
sessionRoutes.delete('/:sessionId/teams/:teamId', customValidator(deleteTeamSchema), deleteTeam);

export { sessionRoutes };
