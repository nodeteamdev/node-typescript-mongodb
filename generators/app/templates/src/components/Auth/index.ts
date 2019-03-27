<%_ if(authentication === 'passport-local-strategy') { _%>
import * as passport from 'passport';
<%_ }_%>
import AuthService from './service';
import HttpError from '../../config/error';
import { IUserModel } from '../User/model';
import { NextFunction, Request, Response } from 'express';
<%_ if(authentication === 'jwt-auth') { _%>
import * as jwt from 'jsonwebtoken';
import app from '../../config/server/server';
<%_ }_%>
<%_ if(authentication === 'oauth2.0') { _%>
import oauth from '../../config/oauth';
import * as OAuth2Server from 'oauth2-server';
<%_ }_%>
<%_ if(authentication === 'passport-local-strategy') { _%>
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction}next 
 * @param {IUserModel} user 
 * @param {string} resMessage 
 */
function passportRequestLogin(req: Request, res: Response, next: NextFunction, user: IUserModel ,resMessage: string): void {
    return req.logIn(user, (err) => {
        if (err) return next(new HttpError(err));

        res.json({
            status: 200,
            logged: true,
            message: resMessage
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
            expiresIn: '60m'
        });;
        
        res.json({
            status: 200,
            logged: true,
            token: token,
            message: 'Sign in successfull'
        });
        <%_ }_%>
        <%_ if(authentication === 'passport-local-strategy') { _%>
        passportRequestLogin(req, res, next, user, 'Sign in successfull');
        <%_ }_%>
        <%_ if(authentication === 'oauth2.0') { _%>
        res.json({
            status: 200,
            user: {
                email: user.email
            }
        });
        <%_ }_%>
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
    <%_ if(authentication === 'passport-local-strategy') { _%>
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
        passportRequestLogin(req, res, next, user, 'Sign in successfull');
    })(req, res, next);
    <%_ }_%>
    <%_ if(authentication === 'jwt-auth') { _%>
    try {
        const user: IUserModel = await AuthService.getUser(req.body);

        const token: string = jwt.sign({ email: user.email }, app.get('secret'), {
            expiresIn: '60m'
        });;
        
        res.json({
            status: 200,
            logged: true,
            token: token,
            message: 'Sign in successfull'
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
    <%_ }_%>
    <%_ if(authentication === 'oauth2.0') { _%>
    const _req: OAuth2Server.Request = new OAuth2Server.Request(req);
    const _res: OAuth2Server.Response = new OAuth2Server.Response(res);

    const options: OAuth2Server.AuthorizeOptions = {
        authenticateHandler: {
            handle: async (req: Request, res: Response): Promise<OAuth2Server.User> => {
                try {
                    const user: OAuth2Server.User = await AuthService.getUser(req.body);

                    return user;
                } catch (error) {
                    throw new Error(error);
                }
            }
        }
    };
    const code: OAuth2Server.AuthorizationCode = await oauth.authorize(_req, _res, options);

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
        const _req: OAuth2Server.Request = new OAuth2Server.Request(req);
        const _res: OAuth2Server.Response = new OAuth2Server.Response(res);
        const token: OAuth2Server.Token = await oauth.token(_req, _res);

        res.json({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        });
    } catch (error) {
        return next(new HttpError(error.status, error.message));
    }
}
<%_ }_%>