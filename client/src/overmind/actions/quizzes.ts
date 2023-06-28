import { Context } from '..';
import { Quiz } from '../effects/api/quizzes/types';

export const loadQuiz = async ({ state, effects }: Context, quizId: string) => {
    state.quiz = await effects.api.quiz.getQuiz(quizId);
};

export const saveQuiz = async ({ effects }: Context, newQuiz: Quiz) => {
    await effects.api.quiz.putQuiz(newQuiz);
};

export const createQuiz = async ({ effects }: Context, title: string) => {
    await effects.api.quiz.createQuiz({ title });
};

export const getAllQuizzes = async ({ effects }: Context) => {
    return await effects.api.quiz.getQuizzes();
};
