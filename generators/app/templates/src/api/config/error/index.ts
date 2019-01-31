import { Response, Request, NextFunction } from 'express';
import * as http from 'http';

/**
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
    status: number;
    message: string;
    name: 'HttpError';

    /**
     * Creates an instance of HttpError.
     * @param {number} [status]
     * @param {string} [message]
     * @memberof HttpError
     */
    constructor(status?: number, message?: string) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.status = status || 500;
        this.name = this.name;
        this.message = message || http.STATUS_CODES[this.status] || 'Error';
    }

    /**
     * @static
     * @param {Error} error
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {(Response | void)}
     * @memberof HttpError
     */
    static errorHandler(error: Error, req: Request, res: Response, next: NextFunction): Response | void {
        if (res.headersSent) {
            return next(error);
        }
        res.status(500);
        res.render('error.ejs', { error });
    }
}

export default HttpError;
