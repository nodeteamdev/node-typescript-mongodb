import * as express from 'express';
import * as React from 'react';
import UserRouter from './UserRouter';
import { IServer } from '../interfaces/ServerInterface';
import { renderToString } from 'react-dom/server';

export default class Routes {
    /**
     * @param  {IServer} server
     * @returns void
     */
    static init(server: IServer): void {
        const router: express.Router = express.Router();

        server.app.use('/', router);
        server.app.use('/', (req, res) => {
            res.render('index', { title: 'Hey', message: 'Hello there!' });
        });
        // users
        server.app.use('/v1/users', new UserRouter().router);
    }
}
