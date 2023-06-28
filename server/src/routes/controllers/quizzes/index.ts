import { Router } from 'express';
import { createQuiz, getQuiz, getQuizzes, putQuiz } from './controller';
import { createQuizSchema, getQuizJoiSchema, getQuizzesJoiSchema, putQuizSchema } from './schema';
import { authMiddleware } from '../../../services/auth';
import { validator as customValidator } from '../../utils';

const quizzesRoutes = Router();

quizzesRoutes.get('/', customValidator(getQuizzesJoiSchema), authMiddleware, getQuizzes);
quizzesRoutes.post('/',  customValidator(createQuizSchema), authMiddleware, createQuiz);
quizzesRoutes.get('/:quizId', customValidator(getQuizJoiSchema), authMiddleware, getQuiz);
quizzesRoutes.put('/:quizId', customValidator(putQuizSchema), authMiddleware, putQuiz);

export { quizzesRoutes };
