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
