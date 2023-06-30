import { Category } from '../quizzes/types';
import { MongoDoc } from '../types';

export interface Team {
    _id: string;
    name: string;
    pointsHistory: number[];
}

export interface Claimed {
    trackId: string;
    teamId: string;
    artistGuessed: boolean;
}

export interface Session extends MongoDoc {
    title: string;
    user: string;
    categories: Category[];
    claimed: Claimed[];
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

export interface PutTeamRequestBody {
    _id: string,
    name: string,
    pointsHistory: number[],
}

export interface PostClaimedRequestBody {
    teamId: string;
    trackId: string;
}
