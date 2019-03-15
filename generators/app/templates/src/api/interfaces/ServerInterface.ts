import * as express from 'express';
import { HttpError } from '../config/error/index';

/**
 * @export
 * @interface IConnectOptions
 */
export interface IConnectOptions {
    autoReconnect: boolean;
    reconnectTries: number; // Never stop trying to reconnect
    reconnectInterval: number;
    loggerLevel ? : string;
}

/**
 *
 * @export
 * @interface CustomResponse
 * @extends {express.Response}
 */
export interface CustomResponse extends express.Response {
    sendHttpError: (error: HttpError | Error, message ? : string) => void;
}
