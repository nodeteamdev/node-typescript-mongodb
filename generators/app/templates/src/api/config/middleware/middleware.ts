import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as passport from 'passport';
import * as session from 'express-session';
import * as path from 'path';
import * as mongo from 'connect-mongo';
import { CustomResponse } from '../../interfaces/ServerInterface';
import { HttpError } from '../error/index';
import { renderFile } from 'ejs';
import { sendHttpErrorModule } from '../error/sendHttpError';
// import * as dotenv from 'dotenv';
import config from '../env/index';

// dotenv.config();
const MongoStore: mongo.MongoStoreFactory = mongo(session);
/**
 * @export
 * @param {express.Application} app
 */
export function configure(app: express.Application): void {
    // express middleware
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    app.use(cookieParser());
    // returns the compression middleware
    app.use(compression());
    // helps you secure your Express apps by setting various HTTP headers
    app.use(helmet());
    // providing a Connect/Express middleware that can be used to enable CORS with various options
    app.use(cors());
    // To serve static files such as images, CSS files, and JavaScript files
    app.use(express.static(path.join(__dirname, '../../../client')));
    // render
    app.set('views', path.join(__dirname, '../../../client'));
    app.engine('html', renderFile);
    app.set('view engine', 'ejs');

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: config.secret,
        name: 'api.sid',
        store: new MongoStore({
            url: `${config.database.MONGODB_URI}${config.database.MONGODB_DB_MAIN}`,
            autoReconnect: true
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // custom errors
    app.use(sendHttpErrorModule);

    // cors
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With,' +
            ' Content-Type, Accept,' +
            ' Authorization,' +
            ' Access-Control-Allow-Credentials'
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
}

/**
 * @export
 * @param {express.Application} app
 */
export function initErrorHandler(app: express.Application): void {
    app.use((error: Error, req: express.Request, res: CustomResponse, next: express.NextFunction) => {
        if (error.name === 'UnauthorizedError') {

        }
        if (typeof error === 'number') {
            error = new HttpError(error); // next(404)
        }

        if (error instanceof HttpError) {
            res.sendHttpError(error);
        } else {
            if (app.get('env') === 'development') {
                error = new HttpError(500, error.message);
                res.sendHttpError(error);
            } else {
                error = new HttpError(500);
                res.sendHttpError(error, error.message);
            }
        }

        console.error(error);
    });
}
