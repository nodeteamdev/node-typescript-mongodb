<%_ if(authentication === 'passport-local-strategy') { _%>
import * as passport from 'passport';
<%_ }_%>
import { NextFunction, Request, Response } from 'express';
<%_ if(authentication === 'jwt-auth') { _%>
import * as jwt from 'jsonwebtoken';
import app from '../../config/server/server';
<%_ }_%>
<%_ if(authentication === 'oauth2.0') { _%>
import * as OAuth2Server from 'oauth2-server';
import oauth from '../../config/oauth';
<%_ }_%>
import AuthService from './service';
import HttpError from '../../config/error';
import { IUserModel } from '../User/model';
<%_ if(authentication === 'passport-local-strategy') { _%>
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction}next
 * @param {IUserModel} user
 * @param {string} resMessage
 */
function passportRequestLogin(req: Request, res: Response, next: NextFunction, user: IUserModel, resMessage: string): void {
    return req.logIn(user, (err) => {
        if (err) return next(new HttpError(err));

        res.json({
            status: 200,
            logged: true,
            message: resMessage,
        });
    });
}
<%_ }_%>

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
        <%_ if(authentication === 'jwt-auth') { _%>
        const token: string = jwt.sign({ email: user.email }, app.get('secret'), {
            expiresIn: '60m',
        });

        res.json({
            status: 200,
            logged: true,
            token,
            message: 'Sign in successfull',
        });
        <%_ }_%>
        <%_ if(authentication === 'passport-local-strategy') { _%>

        passportRequestLogin(req, res, next, user, 'Sign in successfull');
        <%_ }_%>
        <%_ if(authentication === 'oauth2.0') { _%>

        res.json({
            status: 200,
            user: {
                email: user.email,
            },
        });
        <%_ }_%>
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.json({
            status: 400,
            message: error.message,
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
    <%_ if(authentication === 'passport-local-strategy') { _%>
    passport.authenticate('local', (err: Error, user: IUserModel) => {
        if (err) {
            return next(new HttpError(400, err.message));
        }

        if (!user) {
            return res.json({
                status: 401,
                logged: false,
                message: 'Invalid credentials!',
            });
        }
        passportRequestLogin(req, res, next, user, 'Sign in successfull');
    })(req, res, next);
    <%_ }_%>
    <%_ if(authentication === 'jwt-auth') { _%>
    try {
        const user: IUserModel = await AuthService.getUser(req.body);

        const token: string = jwt.sign({ email: user.email }, app.get('secret'), {
            expiresIn: '60m',
        });

        res.json({
            status: 200,
            logged: true,
            token,
            message: 'Sign in successfull',
        });
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }

        res.json({
            status: 400,
            message: error.message,
        });
    }
    <%_ }_%>
    <%_ if(authentication === 'oauth2.0') { _%>
    const reqOAuth: OAuth2Server.Request = new OAuth2Server.Request(req);
    const resOAuth: OAuth2Server.Response = new OAuth2Server.Response(res);

    const options: OAuth2Server.AuthorizeOptions = {
        authenticateHandler: {
            handle: async (request: Request): Promise<OAuth2Server.User> => {
                try {
                    const user: OAuth2Server.User = await AuthService.getUser(request.body);

                    return user;
                } catch (error) {
                    throw new Error(error);
                }
            },
        },
    };
    const code: OAuth2Server.AuthorizationCode = await oauth.authorize(reqOAuth, resOAuth, options);

    res.redirect(`${code.redirectUri}?code=${code.authorizationCode}&state=${req.query.state}`);
    <%_ }_%>
}
<%_ if(authentication === 'passport-local-strategy') { _%>
/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function logout(req: Request, res: Response): Promise < void > {
    if (!req.user) {
        res.json({
            status: 401,
            logged: false,
            message: 'You are not authorized to app. Can\'t logout',
        });
    }

    if (req.user) {
        req.logout();
        res.json({
            status: 200,
            logged: false,
            message: 'Successfuly logged out!',
        });
    }
}
<%_ }_%>
<%_ if(authentication === 'oauth2.0') { _%>
/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function token(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reqOAuth: OAuth2Server.Request = new OAuth2Server.Request(req);
        const resOAuth: OAuth2Server.Response = new OAuth2Server.Response(res);
        const oAuthToken: OAuth2Server.Token = await oauth.token(reqOAuth, resOAuth);

        res.json({
            accessToken: oAuthToken.accessToken,
            refreshToken: oAuthToken.refreshToken,
        });
    } catch (error) {
        return next(new HttpError(error.status, error.message));
    }
}
<%_ }_%>
