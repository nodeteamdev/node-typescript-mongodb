import { Document, Schema } from 'mongoose';
import * as OAuth2Server from 'oauth2-server';
import * as connections from '../connection/connection';
/**
 * @export
 * @interface IAuthCodeModel
 * @extends {Document}
 */
export interface IAuthCodeModel extends Document, OAuth2Server.AuthorizationCodeModel {
    authorizationCode: string;
    expiresAt: Date;
    redirectUri: string;
    scope: string;
    client: OAuth2Server.Client;
    user: OAuth2Server.User;
}

const AuthCodeSchema: Schema = new Schema({
    authorizationCode: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    redirectUri: {
        type: String,
        required: true,
    },
    scope: {
        type: String,
    },
    client: {
        type: Object,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
});

export default connections.db.model< IAuthCodeModel >('AuthCodeModel', AuthCodeSchema);
