import * as Joi from 'joi';
import Validation from '../validation';
import { IUserModel } from '../User/model';

/**
 * @export
 * @class AuthValidation
 * @extends Validation
 */
class AuthValidation extends Validation {

     /**
     * Creates an instance of AuthValidation.
     * @memberof AuthValidation
     */
    constructor() {
        super();
    }
    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    createUser(
        params: IUserModel
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            password: Joi.string().required(),
            email: Joi.string().email({
                minDomainSegments: 2
            }).required()
        });

        return schema.validate(params);
    }
    <%_ if(authentication === 'jwt-auth' || authentication === 'oauth2.0') { _%>
    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    getUser(
        params: IUserModel
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            response_type: Joi.string(),
            state: Joi.string(),
            client_id: Joi.string(),
            password: Joi.string().required(),
            email: Joi.string().email({
                minDomainSegments: 2
            }).required()
        });

        return schema.validate(params);
    } 
    <%_ }_%>
}

export default new AuthValidation();
