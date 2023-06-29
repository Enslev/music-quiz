import { Category } from '../quizzes/types';
import { MongoDoc } from '../types';

export interface Team {
    _id: string;
    name: string;
    pointsHistory: number[];
}

export interface Session extends MongoDoc {
    title: string;
    user: string;
    categories: Category[];
    revealed: string[];
    teams: Team[];
    active: boolean;
    code: string;
}

export interface CreateSessionRequestBody {
    quizId: string;
}

export interface CreateTeamRequestBody {
    name: string,
}
