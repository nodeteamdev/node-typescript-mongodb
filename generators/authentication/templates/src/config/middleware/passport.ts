import * as http from 'http';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import HttpError from '../error';
import UserModel, { IUserModel } from '../../components/User/model';
import { NextFunction, Request, Response } from 'express';

type LocalStrategyType = typeof passportLocal.Strategy;

const LocalStrategy: LocalStrategyType = passportLocal.Strategy;

/**
 * @description
 * determines, which data of the user object should be stored in the session.
 * The result of the serializeUser method is attached to the session 
 * as req.session.passport.user = {}
 */
passport.serializeUser((user: {
    id: number
}, done: Function) => {
    done(undefined, user.id);
});

/**
 * @description
 * checks if user exists in database
 * if everything ok, proceed to route
 */
passport.deserializeUser(async (id: number, done: Function) => {
    try {
        const user: IUserModel = await UserModel.findById(id);
        
        done(null, user);
    } catch (error) {
        done(error);
    }
});

/**
 * @description
 * configuring new local strategy
 * and use it in passport
 */
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email: string, password: string, done: Function): Promise < void > => {
    try {
        const user: IUserModel = await UserModel.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return done(undefined, false, {
                message: `Email ${email} not found.`
            });
        }

        const isMatched: boolean = await user.comparePassword(password);

        if (isMatched) {
            return done(undefined, user);
        }

        return done(undefined, false, {
            message: 'Invalid email or password.'
        });

    } catch (error) {
        done(error);
    }
}));

/**
 * @description Login Required middleware.
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
        return next();
    }

    next(new HttpError(401, http.STATUS_CODES[401]));
}
