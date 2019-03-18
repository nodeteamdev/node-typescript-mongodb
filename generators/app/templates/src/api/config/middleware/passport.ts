import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import UserModel, { IUserModel } from '../../models/UserModel';
import { Request, Response, NextFunction } from 'express';

type LocalStrategyType = typeof passportLocal.Strategy;

const LocalStrategy: LocalStrategyType = passportLocal.Strategy;
/**
 * @interface IPassportUser
 */
interface IPassportUser {
    id: number;
}

passport.serializeUser((user: IPassportUser, done: Function) => {
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

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, done: Function): Promise<void> => {
    try {
        const user: IUserModel = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }

        const isMatch: boolean = await user.comparePassword(password);

        if (isMatch) {
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

    res.redirect('/');
}
