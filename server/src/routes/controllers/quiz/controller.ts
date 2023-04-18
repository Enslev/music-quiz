import { Response } from 'express';
import { QuizModel } from '../../../mongoose/Quiz';
import { CreateQuizSchema, GetQuizSchema, GetQuizzesSchema } from './schema';
import { ValidatedRequest } from 'express-joi-validation';

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

    const newQuiz = await QuizModel.create({
        title: body.title,
        user: req.user._id,
        categories: req.body.categories,
    });

    res.status(200).send(newQuiz);
};
