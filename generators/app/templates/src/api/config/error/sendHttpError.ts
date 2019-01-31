import { HttpError } from './index';
import { NextFunction, Request } from 'express';

/**
 * @exports
 * @param {Request} req
 * @param {*} res
 * @param {NextFunction} next
 */
export const sendHttpErrorModule: (req: any, res: any, next: NextFunction) => void = (req: Request, res: any, next: NextFunction): void => {
    res.sendHttpError = (error: HttpError): void => {
        res.status(error.status);

        // • if this looks like an AJAX request
        // • if this request has a "json" content-type AND ALSO has its "Accept" header set
        // • if this request DOESN'T explicitly want HTML
        if (
            req.xhr
            || req.is('json')
            || (req.is('json') && req.get('Accept'))
            || !(req.get('Accept') && req.get('Accept').indexOf('html') !== -1)
        ) {
            res.json({
                status: error.status,
                name: error.name,
                message: error.message
            });
        } else {
            res.render('error.ejs', {
                error
            });
        }
    };

    next();
};
