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
    <%_ if(authentication === 'jwt-auth' || authentication === 'oauth2.0') { _%>
    /**
     * @param {IUserModel} IUserModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    getUser(IUserModel: IUserModel): Promise < IUserModel >;
    <%_ }_%>
}
