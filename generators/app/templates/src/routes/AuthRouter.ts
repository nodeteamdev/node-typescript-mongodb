import {
    AuthComponent
} from '../components';
import {
    Router
} from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();


/**
 * POST method route
 * @example http://localhost:PORT/signup
 * @swagger
 * /auth/signup/:
 *  post:
 *    description: sign up user to application
 *    tags: ["auth"]
 *    requestBody:
 *      description: sign up body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserSchema'
 *          example:
 *            email: test.user@mail.com
 *            password: test_test
 *    responses:
 *      200:
 *        description: user successfuly signed in
 *        content:
 *          appication/json:
 *            example:
 *              status: 200
 *              logged: true
 *              message: Sign in successfull!!
 *      400:
 *        description: sign in failed
 *        content:
 *          application/json:
 *            example:
 *              status: 400
 *              logged: false
 *              message: Email already exists
 */
router.post('/signup', AuthComponent.signup);

/**
 * POST method route
 * @example http://localhost:PORT/login
 * 
 * @swagger
 * /auth/login/:
 *  post:
 *    description: Login user to application
 *    tags: ["auth"]
 *    requestBody:
 *      description: login body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserSchema'
 *          example:
 *            email: test.user@mail.com
 *            password: test_test
 *    responses:
 *      200:
 *        description: user successfuly logged
 *        content:
 *          appication/json:
 *            example:
 *              status: 200
 *              logged: true
 *              message: Successfully logged!
 *      401:
 *        description: Not logged, invalid credentials
 *        content:
 *          application/json:
 *            example:
 *              status: 401
 *              logged: false
 *              message: Invalid credentials
 */
router.post('/login', AuthComponent.login);

/**
 * POST method route
 * @example http://localhost:3000
 * 
 * @swagger
 * /auth/logout/:
 *  post:
 *    description: Loogout from application
 *    tags: ["auth"]
 *    responses:
 *      200:
 *        description: users successfuly logout
 *        content:
 *          application/json:
 *            example:
 *              status: 200
 *              logged: false
 *              message: Successfuly logged out
 *      401:
 *        description: cant logout user, because he didnt login to app
 *        content:
 *          application/json:
 *            example:
 *              status: 401
 *              logged: false
 *              message: You are not authorized to app. Can't logout
 */
router.post('/logout', AuthComponent.logout);

/**
 * @export {express.Router}
 */
export default router;
