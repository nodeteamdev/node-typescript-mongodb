import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import UserModel, { IUserModel } from '../../components/User/model';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../error';

type LocalStrategyType = typeof passportLocal.Strategy;

const LocalStrategy: LocalStrategyType = passportLocal.Strategy;

passport.serializeUser((user: { id: number }, done: Function) => {
    done(undefined, user.id);
});

passport.deserializeUser(async (id: number, done: Function) => {
    try {
        const user: IUserModel = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.use(new LocalStrategy({ usernameField: 'email' }, async (
    email: string,
    password: string,
    done: Function): Promise<void> => {
    try {
        const user: IUserModel = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }

        const isMatched: boolean = await user.comparePassword(password);

        if (isMatched) {
            return done(undefined, user);
        }

        return done(undefined, false, { message: 'Invalid email or password.' });

    } catch (error) {
        done(error);
    }
}));

/**
 * Login Required middleware.
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
        return next();
    }
    
    next(new HttpError(401, 'Not Authorized'));
}
