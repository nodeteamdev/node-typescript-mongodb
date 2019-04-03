import { HttpError } from './index';
import { NextFunction, Request } from 'express';

/**
 * @exports
 * @param {Request} req
 * @param {*} res
 * @param {NextFunction} next
 * 
 * @swagger
 * components:
 *  schemas:
 *    Error:
 *      type: object
 *      required:
 *        - status
 *        - message
 *      properties:
 *        status:
 *          type: integer
 *          description: HTTP status code
 *          example: 200
 *        message:
 *          type: string
 *          description: Error description
 *          example: User created
 */
export function sendHttpErrorModule(req: Request, res: any, next: NextFunction): void {
    res.sendHttpError = (error: HttpError): void => {
        res.status(error.status);

        /**
         * if this looks like an AJAX request
         * if this request has a "json" content-type AND ALSO has its "Accept" header set
         * if this request DOESN'T explicitly want HTML
         */
        if (
            req.xhr ||
            req.is('json') ||
            (req.is('json') && req.get('Accept')) ||
            !(req.get('Accept') && req.get('Accept').indexOf('html') !== -1)
        ) {
            res.json({
                status: error.status,
                name: error.name,
                message: error.message
            });
        } else {
            res.send(generateHTML(error));
        }
    };

    next();
}

/**
 * 
 * @param error Error
 * @returns {string} HTML response or empty string
 * @description generates HTML for response
 */
const generateHTML: Function = (error: HttpError): string => {
    if (error) {
        return '<div style=\'text-align: center;\'>' +
            `<p>Status: ${error.status}</p>` +
            `<p>Name: ${error.name}</p>` +
            `<p>${error}</p>` +
        `</div>`;
    }

    return '';
};

