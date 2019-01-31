import * as express from 'express';
import Routes from '../router/routes';
import Middleware from '../middleware/middleware';
import Cron from '../cron/cron';

/**
 * @export
 * @class Server
 */
export class Server {
    // set app to be of type express.Application
    public app: express.Application;

    /**
     * Creates an instance of Server.
     * @memberof Server
     */
    constructor() {
        this.app = express();
        Cron.init();
        Middleware.init(this);
        Routes.init(this);
        Middleware.initErrorHandler(this);
    }
}

export default new Server().app;
