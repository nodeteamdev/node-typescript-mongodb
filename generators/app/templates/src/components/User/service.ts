import * as Joi from 'joi';
import { Types } from 'mongoose';
import UserModel, { IUserModel } from './model';
import UserValidation from './validation';
import { IUserService } from './interface';

/**
 * @export
 * @implements {IUserModelService}
 */
const UserService: IUserService = {
    /**
     * @returns {Promise < IUserModel[] >}
     * @memberof UserService
     */
    async findAll(): Promise < IUserModel[] > {
        try {
            return await UserModel.find({});
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async findOne(id: string): Promise < IUserModel > {
        try {
            const validate: Joi.ValidationResult = UserValidation.getUser({
                id,
            });

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            return await UserModel.findOne({
                _id: new Types.ObjectId(id),
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {IUserModel} user
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async insert(body: IUserModel): Promise < IUserModel > {
        try {
            const validate: Joi.ValidationResult = UserValidation.createUser(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const user: IUserModel = await UserModel.create(body);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async remove(id: string): Promise < IUserModel > {
        try {
            const validate: Joi.ValidationResult = UserValidation.removeUser({
                id,
            });

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const user: IUserModel = await UserModel.findOneAndRemove({
                _id: new Types.ObjectId(id),
            });

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default UserService;
