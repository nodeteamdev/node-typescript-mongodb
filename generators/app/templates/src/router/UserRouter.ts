import { Router } from 'express';
import UserController from '../controllers/UserController';

export default class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() :void {
        this.router.get('/', UserController.getUser);
        this.router.post('/', UserController.createUser);
    }
}
