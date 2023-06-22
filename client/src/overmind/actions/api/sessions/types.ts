import { Category } from '../quiz';
import { MongoDoc } from '../types';

export interface Team {
    name: string,
    pointsHistory: number[],
    points: number,
}

export interface Session extends MongoDoc {
    title: string,
    user: string,
    categories: Category[],
    revealed: string[],
    teams: Team,
    active: boolean,
    code: string,
}

export interface createSessionRequestBody {
    quizId: string;
}
