import { IUserModel } from '../User/model';

/**
 * @export
 * @interaface IAuthService
 */
export interface IAuthService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    createUser(userModel: IUserModel): Promise < IUserModel > ;
    <%_ if(authentication === 'jwt-auth' || authentication === 'oauth2.0') { _%>
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    getUser(userModel: IUserModel): Promise < IUserModel >;
    <%_ }_%>
}
