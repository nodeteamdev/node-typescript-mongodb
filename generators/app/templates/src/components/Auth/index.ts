import * as passport from 'passport';
import AuthService from './service';
import HttpError from '../../config/error';
import { IUserModel } from '../User/model';
import { NextFunction, Request, Response } from 'express';

/**
 * @export
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise < void >}
 */
export async function signup(req: Request, res: Response, next: NextFunction): Promise < void > {
    try {
        const user: IUserModel = await AuthService.createUser(req.body);

        req.logIn(user, (err) => {
            if (err) {
                return next(new HttpError(err));
            }
            res.json({
                status: 200,
                logged: true,
                message: 'Sign in successfull!'
            });
        });


    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
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
export async function login(req: Request, res: Response, next: NextFunction): Promise < void > {
    passport.authenticate('local', (err: Error, user: IUserModel) => {
        if (err) {
            return next(new HttpError(400, err.message));
        }

        if (!user) {
            return res.json({
                status: 401,
                logged: false,
                message: 'Invalid credentials!'
            });
        }
        
        req.logIn(user, (err) => {
            if (err) {
                return next(new HttpError(err));
            }
            res.json({
                status: 200,
                logged: true,
                message: 'Successfully logged!'
            });
        });
    })(req, res, next);
}

/**
 * @export
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next
 * @returns {Promise < void >} 
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise < void > {

    if (!req.user) {
        res.json({
            status: 401,
            logged: false,
            message: 'You are not authorized to app. Can\'t logout'
        });
    }

    if (req.user) {
        req.logout();
        res.json({
            status: 200,
            logged: false,
            message: 'Successfuly logged out!'
        });
    }

}
