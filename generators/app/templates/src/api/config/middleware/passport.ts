import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import UserModel, { IUserModel } from '../../models/UserModel';
import { Request, Response, NextFunction } from 'express';

const LocalStrategy: any = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email: any, password: any, done: any): any => {
    UserModel.findOne({ email: email.toLowerCase() }, (err, user: any) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(undefined, user);
            }

            return done(undefined, false, { message: 'Invalid email or password.' });
        });
    });
}));

/**
 * Login Required middleware.
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction):any {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}
