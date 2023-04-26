import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';

export const getTrackJoiSchema = {
    params: Joi.object({
        trackUri: Joi.string().required(),
    }),
};

export interface GetTrackSchema extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
        trackUri: string;
    }
}
