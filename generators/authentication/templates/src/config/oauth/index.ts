import * as OAuth2Server from 'oauth2-server';
import AuthCodeModel, { IAuthCodeModel } from './authCodeModel';
import ClientModel, { IClientModel } from './clientModel';
import TokenModel from './tokenModel';

interface IOAuth2ServerModel extends OAuth2Server.AuthorizationCodeModel, OAuth2Server.RefreshTokenModel {

}
interface IResultDeleteOne {
   deletedCount: Number;
}
// YOU CAN DELETE THIS BLOCK AFTER CLIENT CREATED
const redirectUris: Array<string> = '<%= redirectUris  %>'.split(',').map((item) => {
    return item.trim();
});

const defaultClient: IClientModel = new ClientModel({
    id: '<%= clientId  %>',
    secret: '<%= clientSecret  %>',
    type: 'confidential',
    redirectUris,
    grants: ['authorization_code', 'refresh_token']
});

defaultClient.save((err: Error) => {
    if (err) {
        console.log('error during creating defaultClient');
        console.log(err);
    } else {
        console.log('created defaultClient');
    }
});
/**
 * OAuthServerModel
 *
 * @swagger
 * components:
 *  securitySchemes:
 *    oAuth2AuthCode:
 *      type: oauth2
 *      flows:
 *        authorizationCode:
 *          authorizationUrl: /auth/login
 *          tokenUrl: /auth/token
 *          scopes: {}
 */
const OAuth2ServerModel: IOAuth2ServerModel = {
    /**
     * @param {string} clientId
     * @param {clientSecret} clientSecret
     * @returns {Promise<OAuth2Server.Client | OAuth2Server.Falsey>}
     */
    getClient: async (clientId: string): Promise < OAuth2Server.Client | OAuth2Server.Falsey > => {
        try {
            return await ClientModel.findOne({
                id: clientId,
            });
        } catch (error) {
            throw new Error(error);
        }
    },

    /**
     * @param {OAuth2Server.Token} token
     * @param {OAuth2Server.Client} client
     * @param {OAuth2Server.User} user
     * @returns {Promise<OAuth2Server.Token | OAuth2Server.Falsey>}
     */
    saveToken: async (
        token: OAuth2Server.Token,
        client: OAuth2Server.Client,
        user: OAuth2Server.User,
    ): Promise < OAuth2Server.Token | OAuth2Server.Falsey > => {
        const oAuthtoken: OAuth2Server.Token = {
            user,
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
            client: {
                id: client.id,
                grants: client.grants,
            },
        };

        return TokenModel.create(oAuthtoken);
    },

    /**
     * @param {string} accessToken
     * @returns {Promise<OAuth2Server.Token | OAuth2Server.Falsey>}
     */
    getAccessToken: async (accessToken: string): Promise < OAuth2Server.Token | OAuth2Server.Falsey > => {
        try {
            return await TokenModel.findOne({
                accessToken,
            });
        } catch (error) {
            throw new Error(error);
        }
    },

    /**
     * @param {OAuth2Server.Token} token
     * @param {sring | string[]} scope
     * @returns {Promise<boolean>}
     */
    verifyScope: async (token: OAuth2Server.Token, scope: string | string[]): Promise < boolean > => {
        return token.scope === scope;
    },

    /**
     * @param {string} authorizationCode
     * @returns {Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey>}
     */
    getAuthorizationCode: async (authorizationCode: string): Promise < OAuth2Server.AuthorizationCode | OAuth2Server.Falsey > => {
        try {
            const authCode: IAuthCodeModel = await AuthCodeModel.findOne({
                authorizationCode,
            });

            const code: OAuth2Server.AuthorizationCode = {
                authorizationCode: authCode.authorizationCode,
                expiresAt: authCode.expiresAt,
                redirectUri: authCode.redirectUri,
                scope: authCode.scope,
                client: {
                    id: authCode.client.id,
                    grants: authCode.client.grants,
                },
                user: authCode.user,
            };

            return code;
        } catch (error) {
            throw new Error(error);
        }
    },

    /**
     * @param {Auth2Server.AuthorizationCode} code
     * @param {Auth2Server.Client} client
     * @param {Auth2Server.User} user
     * @returns {Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey>}
     */
    saveAuthorizationCode: async (
        code: OAuth2Server.AuthorizationCode,
        client: OAuth2Server.Client,
        user: OAuth2Server.User,
    ): Promise < OAuth2Server.AuthorizationCode | OAuth2Server.Falsey > => {
        const authorizationCode: OAuth2Server.AuthorizationCode = {
            client: {
                id: client.id,
                grants: client.grants,
            },
            user: user.id,
            scope: code.scope,
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            redirectUri: code.redirectUri,
        };

        return AuthCodeModel.create(authorizationCode);
    },

    /**
     * @param {OAuth2Server.AuthorizationCode} authorizationCode
     * @returns {Promise<boolean>}
     */
    revokeAuthorizationCode: async (authorizationCode: OAuth2Server.AuthorizationCode): Promise < boolean > => {
        try {
            const result: IResultDeleteOne = await AuthCodeModel.deleteOne({
                authorizationCode: authorizationCode.authorizationCode,
            });

            return result.deletedCount > 0;
        } catch (error) {
            throw new Error(error);
        }
    },

    /**
     * @param {string} refreshToken
     * @returns {Promise<OAuth2Server.RefreshToken | OAuth2Server.Falsey>}
     */
    getRefreshToken: async (refreshToken: string): Promise < OAuth2Server.RefreshToken | OAuth2Server.Falsey > => {
        try {
            return await TokenModel.findOne({
                refreshToken,
            });
        } catch (error) {
            throw new Error(error);
        }
    },

    /**
     * @param {OAuth2Server.RefreshToken} token
     * @returns {Promise<boolean>}
     */
    revokeToken: async (token: OAuth2Server.RefreshToken): Promise < boolean > => {
        try {
            const result: IResultDeleteOne = await TokenModel.deleteOne({
                refreshToken: token.refreshToken,
            });

            return result.deletedCount > 0;
        } catch (error) {
            throw new Error(error);
        }
    },
};

/**
 * @exports
 */
export default new OAuth2Server({
    accessTokenLifetime: 12 * 60 * 60,
    allowBearerTokensInQueryString: true,
    model: OAuth2ServerModel,
});
