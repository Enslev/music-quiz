import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';

const validPopulationProps = ['user'] as const;

export const getQuizJoiSchema = {
    query: Joi.object({
        populate: Joi.array().single().items(Joi.string().valid(...validPopulationProps)),
    }),
};
export interface GetQuizSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        populate: typeof validPopulationProps[number][];
    },
    [ContainerTypes.Params]: {
        quizId: string;
    }
}


export const getQuizzesJoiSchema = {
    query: Joi.object({
        populate: Joi.array().single().items(Joi.string().valid(...validPopulationProps)),
    }),
};

export interface GetQuizzesSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        populate: typeof validPopulationProps[number][];
    }
}

export const createQuizSchema = {
    body: Joi.object({
        title: Joi.string(),
    }),
};

export interface CreateQuizSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        title: string;
    }
}

export const putQuizSchema = {
    body: Joi.object({
        _id: Joi.string(),
        title: Joi.string(),
        user: Joi.string(),
        __v: Joi.number(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
        categories: Joi.array().length(6).items(Joi.object({
            _id: Joi.string(),
            title: Joi.string().allow(''),
            tracks: Joi.array().length(5).items(Joi.object({
                _id: Joi.string(),
                title: Joi.string().allow(''),
                artist: Joi.string().allow(''),
                trackUrl: Joi.string().allow(''),
                points: Joi.number(),
                startPosition: Joi.number().default(0),
                length: Joi.number().default(0),
            })),
        })),
    }),
};

export interface PutQuizSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        _id: string;
        title: string;
        categories: {
            _id: string;
            title: string;
            tracks: {
                _id: string;
                title: string;
                artist: string;
                trackUrl: string;
                points: number;
                startPosition: number,
                length: number,
            }[]
        }[]
    },
    [ContainerTypes.Params]: {
        quizId: string;
    }
}
