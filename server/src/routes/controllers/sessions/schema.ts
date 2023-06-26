import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';

export const createSessionSchema = {
    body: Joi.object({
        quizId: Joi.string().required(),
    }),
};

export interface CreateSessionSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        quizId: string;
    }
}

export const getSessionSchema = {
    params: Joi.object({
        sessionCode: Joi.string().required(),
    }),
};

export interface GetSessionSchema extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
        sessionCode: string;
    }
}
