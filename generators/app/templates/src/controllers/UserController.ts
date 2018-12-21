import { HttpError } from './../error/index';
import UserModel from '../models/UserModel';
import * as express from 'express';
import * as Joi from 'joi';

/**
 * @class UserController
 */
class UserController {
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @memberof UserController
     */
    public getUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const schema: Joi.Schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email({ minDomainAtoms: 2 }).required()
        });

        const validate: Joi.ValidationResult<{ name: string, email: string }> = Joi.validate(req.query, schema);

        if (validate.error) {
            return next(new HttpError(400, validate.error.message));
        }

        UserModel
            .findOne(req.query)
            .then((data) => {
                res.status(200).json({
                    data
                });
            })
            .catch((error: Error) => {
                next(new HttpError(500, error.message));
            });
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @memberof UserController
     */
    public createUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const schema: Joi.Schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email({ minDomainAtoms: 2 }).required()
        });

        const validate: Joi.ValidationResult<{ name: string, email: string }> = Joi.validate(req.query, schema);

        if (validate.error) {
            return next(new HttpError(400, validate.error.message));
        }

        UserModel
            .create(req.query)
            .then((data) => {
                res.status(200).json({
                    data
                });
            })
            .catch((error: Error) => {
                next(new HttpError(500, error.message));
            });
    }
}

export default new UserController();
