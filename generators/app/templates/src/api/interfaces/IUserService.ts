import { IUserModel } from '../models/UserModel';

/**
 * @export
 * @interface IUserService
 */
export interface IUserService {

    /**
     * @returns {Promise<IUserModel[]>}
     * @memberof IUserService
     */
    FindAll(): Promise<IUserModel[]>;

    /**
     * @param {string} code
     * @returns {Promise<IUserModel>}
     * @memberof IUserService
     */
    Find(code: string): Promise<IUserModel>;

    /**
     * @param {IUserModel} IUserModel
     * @returns {Promise<IUserModel>}
     * @memberof IUserService
     */
    Insert(IUserModel: IUserModel): Promise<IUserModel>;

    /**
     * @param {string} id
     * @returns {Promise<IUserModel>}
     * @memberof IUserService
     */
    Delete(id: string): Promise<IUserModel>;
}
