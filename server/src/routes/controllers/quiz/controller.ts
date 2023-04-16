import { Request, Response } from 'express';
import { QuizModel } from '../../../mongoose/Quiz';
import { ValidatedRequest } from 'express-joi-validation';
import { CreateQuizSchema } from './schema';

export const getQuizzes = async (req: Request, res: Response) => {
    res.status(200).send({ message: 'Ayye' });
};

export const createQuiz = async (req: ValidatedRequest<CreateQuizSchema>, res: Response) => {
    const newQuiz = await QuizModel.create({
        title: 'Wonderful quiz',
        user: '643bfa81602e67bb786e4a0b',
        categories: [{
            title: 'Mystery',
            tracks: [{
                points: 500,
                trackUrl: 'spotify:track:whatever',
            }],
        }],
    });

    res.status(200).send({ newQuiz });
};
