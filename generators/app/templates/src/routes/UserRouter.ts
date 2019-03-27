import { Router } from 'express';
import { UserComponent } from '../components';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * GET method route
 * @example http://localhost:PORT/v1/users
 * 
 * @swagger
 * /v1/users:
 *   get:
 *     description: Get all stored users in Database
 *     tags: ["users"]
<%_ if(authentication === 'passport-local-strategy') { _%>
 *     security:
 *      - cookieAuth: []
<%_ }_%>  
<%_ if(authentication === 'jwt-auth') { _%>
 *     security:
 *      - ApiKeyAuth: []
<%_ }_%>  
 *     responses:
 *       200:
 *         description: An array of users
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                - $ref: '#/components/schemas/Users'
 *       default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.get('/', UserComponent.findAll);

/**
 * POST method route
 * @example http://localhost:PORT/v1/users
 * 
 * @swagger
 * /v1/users:
 *   post:
 *      description: Create new User
 *      tags: ["users"]
<%_ if(authentication === 'passport-local-strategy') { _%>
 *      security:
 *       - cookieAuth: []
<%_ }_%>  
<%_ if(authentication === 'jwt-auth') { _%>
 *      security:
 *       - ApiKeyAuth: []
<%_ }_%> 
 *      requestBody:
 *        description: user creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserSchema'
 *            example:
 *              name: userName
 *              email: test.user@mail.com
 *      responses:
 *        201:
 *          description: return created user
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/UserSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', UserComponent.create);

/**
 * GET method route 
 * @example http://localhost:PORT/v1/users/:id
 * 
 * @swagger
 * /v1/users/{id}:
 *  get:
 *    description: Get user by userId
 *    tags: ["users"]
<%_ if(authentication === 'passport-local-strategy') { _%>
 *    security:
 *      - cookieAuth: []
<%_ }_%>  
<%_ if(authentication === 'jwt-auth') { _%>
 *    security:
 *      - ApiKeyAuth: []
<%_ }_%>  
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the unique userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: return user by id
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/UserSchema'
 */
router.get('/:id', UserComponent.findOne);

/**
 * DELETE method route
 * @example  http://localhost:PORT/v1/users/:id
 * 
 * @swagger
 * /v1/users/{id}:
 *  delete:
 *    description: Delete user by userId
 *    tags: ["users"]
<%_ if(authentication === 'passport-local-strategy') { _%>
 *    security:
 *      - cookieAuth: []
<%_ }_%>  
<%_ if(authentication === 'jwt-auth') { _%>
 *    security:
 *      - ApiKeyAuth: []
<%_ }_%> 
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the unique userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: return deleted user
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/UserSchema'
 */
router.delete('/:id', UserComponent.remove);

/**
 * @export {express.Router}
 */
export default router;
