import * as Joi from 'joi';
import UserModel, { IUserModel } from '../../models/UserModel';
import UserValidation from './UserValidation';
import { IUserService } from '../../interfaces/IUserService';
import { Types } from 'mongoose';

/**
 * @export
 * @class UserService
 * @implements {IUserModelService}
 */
class UserService implements IUserService {

    /**
     * @returns {Promise < IUserModel[] >}
     * @memberof UserService
     */
    async FindAll(): Promise < IUserModel[] > {
        try {
            return await UserModel.find({});
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async Find(id: string): Promise < IUserModel > {
        try {
            const validate: Joi.ValidationResult < {
                id: string
            } > = UserValidation.getUser({
                id
            });

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            return await UserModel.findOne({
                _id: Types.ObjectId(id)
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * @param {IUserModel} user
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async Insert(body: IUserModel): Promise < IUserModel > {
        try {
            const validate: Joi.ValidationResult < IUserModel > = UserValidation.createUser(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const user: IUserModel = await UserModel.create(body);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async Delete(id: string): Promise < IUserModel > {
        try {
            const validate: Joi.ValidationResult < {
                id: string
            } > = UserValidation.deleteUser({
                id
            });

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const user: IUserModel = await UserModel.findOneAndRemove({
                _id: Types.ObjectId(id)
            });

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new UserService();
