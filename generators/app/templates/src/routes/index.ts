import * as express from 'express';
import * as http from 'http';
import UserRouter from './UserRouter';
import AuthRouter from './AuthRouter';
import * as passportConfig from '../config/middleware/passport';
import * as swaggerUi from 'swagger-ui-express';

let swaggerDoc:any;
try {
    swaggerDoc = require('../../swagger.json');
} catch (error) {
    console.error('error: ', error);
}

/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
    const router: express.Router = express.Router();

    /**
     * Forwards any requests to the /v1/users URI to our UserRouter
     * @constructs
     */
    app.use('/v1/users', passportConfig.isAuthenticated, UserRouter);

    /**
     * Forwards any requests to the /auth URI to our AuthRouter
     * @constructs
     */
    app.use('/auth', AuthRouter);

    app.get('/account', passportConfig.isAuthenticated, (req, res) => {
        res.render('account');
    });

    if (swaggerDoc) {
        app.use('/docs', swaggerUi.serve);
        app.get('/docs', swaggerUi.setup(swaggerDoc));
    }

    /**
     * respond with "hello world" when a GET request is made to the homepage
     * @constructs
     */
    app.get('/', (req, res) => {
        if (req.user) {
            return res.status(200).json({
                status: 200,
                logged: true
            });
        }

        res.status(401).json({
            status: 401,
            logged: false,
            message: 'Not Authorized!'
        });
    });


    app.use((req, res, next) => {
        // After successful login, redirect back to the intended page
        if (!req.user &&
            req.path !== '/login' &&
            req.path !== '/signup' &&
            !req.path.match(/^\/auth/) &&
            !req.path.match(/\./)) {
            req.session.returnTo = req.path;
        } else if (req.user &&
            req.path === '/account') {
            req.session.returnTo = req.path;
        }
        next();
    });

    /** 
     * No results returned mean the object is not found
     * @constructs
     */
    app.use((req, res, next) => {
        res.status(404).send(http.STATUS_CODES[404]);
    });

    /**
     * @constructs all routes
     */
    app.use(router);
}
