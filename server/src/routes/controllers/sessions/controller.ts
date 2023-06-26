import { Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { CreateSessionSchema, GetSessionSchema } from './schema';
import { Types } from 'mongoose';
import { QuizModel } from '../../../mongoose/Quiz';
import { SessionDocument, SessionModel } from '../../../mongoose/Session';
import { makeCode } from './utils';

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

    // We allow 10 attempts at creating a unique code, which should be more than enough
    let code = '';
    let codeAttempts = 0;
    let sessionByCode: SessionDocument | null = null;
    do {
        code = makeCode(5);
        sessionByCode = await SessionModel.findOne({ code });
        codeAttempts++;
    } while (sessionByCode != null && codeAttempts <= 10);

    if (sessionByCode != null) {
        res.status(500).send({
            message: 'Something went wrong while generating unique code',
        });
        return;
    }

    const sessionDoc = await SessionModel.create({
        title: quiz.title,
        categories: quiz.categories,
        user: req.user._id,
        code: code,
    });

    res.status(200).send(sessionDoc);
};

export const getSessions = async (req: ValidatedRequest<GetSessionSchema>, res: Response) => {
    const sessionDoc = await SessionModel.findOne({ code: req.params.sessionCode });

    if (!sessionDoc) {
        throw { message: 'Session not Found' };
    }

    res.status(200).send(sessionDoc);
};
