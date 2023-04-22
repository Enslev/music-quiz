import { Router } from 'express';
import { createQuiz, getQuiz, getQuizzes, putQuiz } from './controller';
import { createQuizSchema, getQuizJoiSchema, getQuizzesJoiSchema, putQuizSchema } from './schema';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';

const router = Router({ mergeParams: true });

router.get('/', customValidator(getQuizzesJoiSchema), authMiddleware, getQuizzes);
router.post('/',  customValidator(createQuizSchema), authMiddleware, createQuiz);
router.get('/:quizId', customValidator(getQuizJoiSchema), authMiddleware, getQuiz);
router.put('/:quizId', customValidator(putQuizSchema), authMiddleware, putQuiz);

export default router;
