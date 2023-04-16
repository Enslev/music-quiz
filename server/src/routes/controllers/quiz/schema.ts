import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';
import 'joi-extract-type';


export const createQuizBodySchema = Joi.object({
    title: Joi.string().required(),
    user: Joi.string().required(),
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
        user: string;
        categories: {
            title: string;
            tracks: {
                points:number;
                trackUrl: string;
            }[]
        }[]
    }
}
