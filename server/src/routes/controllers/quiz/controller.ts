import { Response } from 'express';
import { QuizModel } from '../../../mongoose/Quiz';
import { CreateQuizSchema, GetQuizzesSchema } from './schema';
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

export const createQuiz = async (req: ValidatedRequest<CreateQuizSchema>, res: Response) => {
    const body = req.body;

    
    const newQuiz = await QuizModel.create({
        title: body.title,
        user: req.user._id,
        categories: req.body.categories,
    });

    res.status(200).send(newQuiz);
};
