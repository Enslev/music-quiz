import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';

const validPopulationProps = ['user'] as const;
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

export const createQuizBodySchema = Joi.object({
    title: Joi.string().required(),
    categories: Joi.array().items(Joi.object({
        title: Joi.string().required(),
        tracks: Joi.array().items(Joi.object({
            poins: Joi.number().positive(),
            trackUrl: Joi.string().required(),
        })),
    })),
});

export interface CreateQuizSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        title: string;
        categories: {
            title: string;
            tracks: {
                points:number;
                trackUrl: string;
            }[]
        }[]
    }
}
