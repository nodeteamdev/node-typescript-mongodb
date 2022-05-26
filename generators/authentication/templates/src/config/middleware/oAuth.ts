import * as OAuth2Server from 'oauth2-server';
import { NextFunction, Request, Response } from 'express';
import HttpError from '../error';
import oauth from '../oauth';

type Opt = {
    scope ? : string | string[]
};
/**
 *
 * @param {Opt} opt
 * @returns {Promise < void >}
 */
export default function (opt: Opt = {}) {
    return async function (req: Request, res: Response, next: NextFunction): Promise < void > {
        const reqOAuth: OAuth2Server.Request = new OAuth2Server.Request({
            headers: {
                authorization: req.headers.authorization,
            },
            method: req.method,
            query: req.query,
            body: req.body,
        });

        const resOAuth: OAuth2Server.Response = new OAuth2Server.Response(res);
        try {
            await oauth.authenticate(reqOAuth, resOAuth, opt);

            return next();
        } catch (error) {
            return next(new HttpError(error.status, error.message));
        }
    };
}
