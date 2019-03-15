import * as UserController from '../../controllers/UserController';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * GET method route
 * @example http://localhost:PORT/v1/users
 */
router.get('/', UserController.findAll);

/**
 * POST method route
 * @example http://localhost:PORT/v1/users
 */
router.post('/', UserController.create);

/**
 * GET method route 
 * @example http://localhost:PORT/v1/users/:id
 */
router.get('/:id', UserController.findOne);

/**
 * DELETE method route
 * @example  http://localhost:PORT/v1/users/:id
 */
router.delete('/:id', UserController.remove);

/**
 * @export {express.Router}
 */
export default router;
