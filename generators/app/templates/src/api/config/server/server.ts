import * as express from 'express';
import * as Routes from '../router/routes';
import * as Middleware from '../middleware/middleware';
import * as Passport from '../middleware/passport';

/**
 * @constant {express.Application}
 */
const app: express.Application = express();

/** 
 * @constructs express.Application Middleware
 */
Middleware.configure(app);

/**
 * @constructs express.Application Routes
 */
Routes.init(app);

/**
 * @constructs express.Application Error Handler
 */
Middleware.initErrorHandler(app);

/**
 * sets port 3000 to default or unless otherwise specified in the environment
 */
app.set('port', process.env.PORT || 3000);

/**
 * @exports {express.Application}
 */
export default app;
