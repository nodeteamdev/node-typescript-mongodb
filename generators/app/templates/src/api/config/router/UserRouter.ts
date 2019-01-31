import UserController from '../../controllers/UserController';
import { Router } from 'express';

/**
 * @export
 * @class UserRouter
 */
class UserRouter {
    public router: Router;

    /**
     * Creates an instance of UserRouter.
     * @memberof UserRouter
     */
    constructor() {
        this.router = Router();
        this.routes();
    }

    /**
     * @memberof UserRouter
     */
    public routes(): void {
        this.router.get('/', UserController.findAll.bind(UserController));
        this.router.get('/:id', UserController.find.bind(UserController));
        this.router.post('/', UserController.create.bind(UserController));
        this.router.delete('/:id', UserController.delete.bind(UserController));
    }
}

export default new UserRouter();
