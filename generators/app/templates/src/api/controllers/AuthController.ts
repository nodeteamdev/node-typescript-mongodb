import * as passport from 'passport';
import UserModel from '../models/UserModel';
import { NextFunction, Request, Response } from 'express';

export async function signup(req: Request, res: Response, next: NextFunction): Promise < any > {
    const {
        body: {
            email,
            password
        }
    }: any = req;

    const user: any = new UserModel({
        email,
        password
    });

    UserModel.findOne({
        email: req.body.email
    }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.json('Account with that email address already exists.');
        }

        user.save((err: any) => {

            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise < any > {
    passport.authenticate('local', (err: Error, user: any, info: any) => {
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
