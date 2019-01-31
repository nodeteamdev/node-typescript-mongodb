import * as express from 'express';
import UserRouter from './UserRouter';
import { IServer } from '../../interfaces/ServerInterface';

/**
 * @export
 * @class Routes
 */
export default class Routes {
    /**
     * @static
     * @param {IServer} server
     * @memberof Routes
     */
    static init(server: IServer): void {
        const router: express.Router = express.Router();

        // users
        server.app.use('/v1/users', UserRouter.router);

        // index
        server.app.use('/', (req, res) => {
            res.render('index', {
                title: 'Hey',
                message: 'Hello there!'
            });
        });

        server.app.use(router);
    }
}
