import { Router } from 'express';
import { createQuiz, getQuizzes } from './controller';
import { createValidator } from 'express-joi-validation';
import { createQuizBodySchema } from './schema';

const validator = createValidator();
const router = Router({ mergeParams: true });

router.get('/', getQuizzes);
router.post('/',  validator.body(createQuizBodySchema), createQuiz);

export default router;
