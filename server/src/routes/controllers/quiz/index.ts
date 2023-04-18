import { Router } from 'express';
import { createQuiz, getQuizzes } from './controller';
import { createValidator } from 'express-joi-validation';
import { createQuizBodySchema, getQuizzesJoiSchema } from './schema';
import { authMiddleware } from '../../../services/auth';

const validator = createValidator();
const router = Router({ mergeParams: true });

router.get('/', validator.query(getQuizzesJoiSchema.query), authMiddleware, getQuizzes);
router.post('/',  validator.body(createQuizBodySchema), authMiddleware, createQuiz);

export default router;
