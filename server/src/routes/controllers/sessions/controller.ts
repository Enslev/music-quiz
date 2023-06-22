import { Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { CreateSessionSchema } from './schema';
import { Types } from 'mongoose';
import { Quiz, QuizModel } from '../../../mongoose/Quiz';
import { SessionModel } from '../../../mongoose/Session';

export const createSession = async (req: ValidatedRequest<CreateSessionSchema>, res: Response) => {

    if (!Types.ObjectId.isValid(req.body.quizId)) {
        res.status(400).send({
            message: 'Invalid id',
        });
        return;
    }

    const quiz = await QuizModel.findById(req.body.quizId);

    if (!quiz) {
        res.status(404).send({
            message: 'Quiz not found',
        });
        return;
    }

    const sessionDoc = await SessionModel.create({
        title: quiz.title,
        categories: quiz.categories,
        user: req.user._id,
    });

    res.status(200).send(sessionDoc);
};

export const getSessions = async (req: unknown, res: Response) => {
    res.status(200).send();
};
