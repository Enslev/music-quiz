import { Response } from 'express';
import { QuizModel } from '../../../mongoose/Quiz';
import { CreateQuizSchema, GetQuizSchema, GetQuizzesSchema, PutQuizSchema } from './schema';
import { ValidatedRequest } from 'express-joi-validation';
import { initQuiz } from '../../../services/quiz';
import { Types } from 'mongoose';

export const getQuizzes = async (req: ValidatedRequest<GetQuizzesSchema>, res: Response) => {

    let quizzesQuery = QuizModel.find({ user: req.user._id });
    if (req.query.populate) {
        req.query.populate.forEach((populateProp) => {
            quizzesQuery = quizzesQuery.populate(populateProp);
        });
    }

    const quizzes = await quizzesQuery;

    res.status(200).send(quizzes);
};

export const getQuiz = async (req: ValidatedRequest<GetQuizSchema>, res: Response) => {
    if (!Types.ObjectId.isValid(req.params.quizId)) {
        res.status(400).send({
            message: 'Invalid id',
        });
        return;
    }

    let quizzesQuery = QuizModel.findOne({
        user: req.user._id,
        _id: req.params.quizId,
    });

    if (req.query.populate) {
        req.query.populate.forEach((populateProp) => {
            quizzesQuery = quizzesQuery.populate(populateProp);
        });
    }

    const quizzes = await quizzesQuery;

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

    const quizFromDB = await QuizModel.findById(req.body._id);

    if (!quizFromDB) return res.sendStatus(404);
    if (quizFromDB.user != req.user.id) return res.sendStatus(403);

    const updatedQuiz = await QuizModel.findByIdAndUpdate(req.body._id, req.body);
    res.status(200).send(updatedQuiz);
};
