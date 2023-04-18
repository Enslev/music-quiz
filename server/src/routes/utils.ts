import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { RequestHandler } from 'express';

interface ValidatorObject {
    body?: Joi.ObjectSchema,
    fields?: Joi.ObjectSchema,
    headers?: Joi.ObjectSchema,
    params?: Joi.ObjectSchema,
    query?: Joi.ObjectSchema,
    response?: Joi.ObjectSchema,
}

const expressValidator = createValidator();

export const validator = (validatorObject: ValidatorObject): RequestHandler[] => {
    const validators: RequestHandler[] = [];

    if (validatorObject.body) validators.push(expressValidator.body(validatorObject.body));
    if (validatorObject.fields) validators.push(expressValidator.fields(validatorObject.fields));
    if (validatorObject.headers) validators.push(expressValidator.headers(validatorObject.headers));
    if (validatorObject.params) validators.push(expressValidator.params(validatorObject.params));
    if (validatorObject.query) validators.push(expressValidator.query(validatorObject.query));
    if (validatorObject.response) validators.push(expressValidator.response(validatorObject.response));

    return validators;
};
