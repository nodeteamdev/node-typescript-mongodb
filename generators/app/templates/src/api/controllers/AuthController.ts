import * as passport from 'passport';
import { IUserModel } from '../models/UserModel';
import AuthService from '../services/AuthService';
import { NextFunction, Request, Response } from 'express';
import HttpError from '../config/error';


/**
 * @export
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise < void >}
 */

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: IUserModel = await AuthService.createUser(req.body);

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            console.log('everything ok');
            res.redirect('/');
        });


    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        console.log('ERROR_AUTH_CONTROLLER:', error);
        res.json({
            status: 400,
            message: error.message
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate('local', (err: Error, user: any, info: any) => {
        console.log('passportUser:', user);
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.redirect('/auth/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/account');
        });
    })(req, res, next);
}
