import * as OAuth2Server from 'oauth2-server';
import HttpError from '../error';
import oauth from '../oauth';
import { NextFunction, Request, Response } from 'express';

type Opt = {
    scope ? : string | string[]
};
/**
 * 
 * @param {Opt} opt 
 * @returns {Promise < void >}
 */
export default function (opt: Opt = {}): Function {
    return async function (req: Request, res: Response, next: NextFunction): Promise < void > {
        const _req: OAuth2Server.Request = new OAuth2Server.Request({
            headers: {
                authorization: req.headers.authorization,
            },
            method: req.method,
            query: req.query,
            body: req.body
        });

        const _res: OAuth2Server.Response = new OAuth2Server.Response(res);

        oauth.authenticate(_req, _res, opt)
        .then((token): any => {
            return next();
        })
        .catch((err) => {
            return next(new HttpError(err.status, err.message));
        });
    };
}
