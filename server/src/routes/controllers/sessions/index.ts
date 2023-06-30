import { Router } from 'express';
import { createSession, createTeam, deleteTeam, getSessions, postClaimed, putTeam } from './controller';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';
import { createSessionSchema, createTeamSchema, deleteTeamSchema, getSessionSchema, postClaimedSchema, putTeamSchema } from './schema';

const sessionRoutes = Router();

sessionRoutes.post('/', customValidator(createSessionSchema), authMiddleware, createSession);
sessionRoutes.get('/:sessionCode', customValidator(getSessionSchema), getSessions);

sessionRoutes.post('/:sessionId/teams', customValidator(createTeamSchema), authMiddleware, createTeam);
sessionRoutes.put('/:sessionId/teams/:teamId', customValidator(putTeamSchema), authMiddleware, putTeam);
sessionRoutes.delete('/:sessionId/teams/:teamId', customValidator(deleteTeamSchema), authMiddleware, deleteTeam);

sessionRoutes.post('/:sessionId/claimed', customValidator(postClaimedSchema), authMiddleware, postClaimed);

export { sessionRoutes };
