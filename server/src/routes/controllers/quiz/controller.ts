import { Response } from 'express';
import { QuizModel } from '../../../mongoose/Quiz';
import { CreateQuizSchema, GetQuizSchema, GetQuizzesSchema, PutQuizSchema } from './schema';
import { ValidatedRequest } from 'express-joi-validation';
import { initQuiz, sanitizeQuizRequest } from '../../../services/quiz';
import { Types } from 'mongoose';

export const getQuizzes = async (req: ValidatedRequest<GetQuizzesSchema>, res: Response) => {

    let quizzesPromise = QuizModel.find({ user: req.user._id });

    if (req.query.populate) {
        req.query.populate.forEach((populateProp) => {
            quizzesPromise = quizzesPromise.populate(populateProp);
        });
    }

    const quizzes = await quizzesPromise;

    res.status(200).send(quizzes);
};

export const getQuiz = async (req: ValidatedRequest<GetQuizSchema>, res: Response) => {
    let quizzesPromise = QuizModel.findOne({
        user: req.user._id,
        _id: req.params.quizId,
    });

    if (req.query.populate) {
        req.query.populate.forEach((populateProp) => {
            quizzesPromise = quizzesPromise.populate(populateProp);
        });
    }

    const quizzes = await quizzesPromise;

    if (quizzes == null) {
        res.status(404).send();
        return;
    }

    res.status(200).send(quizzes);
};

export const createQuiz = async (req: ValidatedRequest<CreateQuizSchema>, res: Response) => {
    const body = req.body;

    const newQuiz = initQuiz(req.user._id, body.title);
    const quizDoc = await QuizModel.create(newQuiz);

    res.status(200).send(quizDoc);
};

export const putQuiz = async (req: ValidatedRequest<PutQuizSchema>, res: Response) => {

    const sanitizedQuiz = sanitizeQuizRequest(req.body);
    const quizFromDB = await QuizModel.findById(req.body._id);

    if (!quizFromDB) return res.status(404).send();

    console.log(req.params.quizId);

    const updatedQuiz = await QuizModel.findOneAndUpdate({
        _id: new Types.ObjectId(req.params.quizId),
    }, sanitizedQuiz);

    res.status(200).send(updatedQuiz);
};
