import * as AuthController from '../../controllers/AuthController';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * POST method route
 * @example http://localhost:PORT/login
 */
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);

/**
 * @export {express.Router}
 */
export default router;
