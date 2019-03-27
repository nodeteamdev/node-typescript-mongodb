import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import app from '../server/server';
import HttpError from '../error';
import * as http from 'http';

interface RequestWithUser extends Request {
    user: object | string;
}

/**
 * 
 * @param {RequestWithUser} req 
 * @param {Response} res 
 * @param {NextFunction} next
 * @returns {void}
 * @swagger
 *  components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 */
export function isAuthenticated(req: RequestWithUser, res: Response, next: NextFunction): void {
    const token: any = req.headers['x-access-token'];

    if (token) {
        try {
            const user: object | string = jwt.verify(token, app.get('secret'));

            req.user = user;

            return next();

        } catch (error) {
            return next(new HttpError(401, http.STATUS_CODES[401]));
        }
    }

    return next(new HttpError(400, 'No token provided'));

}
