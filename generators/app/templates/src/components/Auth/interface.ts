import { IUserModel } from '../User/model';

/**
 * @export
 * @interaface IAuthService
 */
export interface IAuthService {
    /**
     * @param {IUserModel} IUserModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    createUser(IUserModel: IUserModel): Promise < IUserModel > ;
}
