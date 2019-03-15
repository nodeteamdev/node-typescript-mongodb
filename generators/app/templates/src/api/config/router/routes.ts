import * as express from 'express';
import * as http from 'http';
import UserRouter from './UserRouter';
import AuthRouter from './AuthRouter';
import auth from '../middleware/auth';
import * as passportConfig from '../middleware/passport';

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
     * Forwards any requests to the /v1/users URI to our UserRouter
     * @constructs
     */
    app.use('/auth', AuthRouter);

    app.get('/account', passportConfig.isAuthenticated, (req, res) => {
        res.render('account');
    });

    /**
     * respond with "hello world" when a GET request is made to the homepage
     * @constructs
     */
    app.get('/', (req, res) => {
        if (req.user) {
            return res.redirect('/account');
        }
        
        res.render('index', {
            title: 'Hey',
            message: 'Hello world!'
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
