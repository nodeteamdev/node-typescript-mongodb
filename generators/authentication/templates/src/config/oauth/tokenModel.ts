import * as OAuth2Server from 'oauth2-server';
import { Document, Schema, Types } from 'mongoose';
import * as connections from '../connection/connection';
import { IUserModel } from '../../components/User/model';

/**
 * @exports
 * @interface ITokenModel
 * @extends {Document}
 */
export interface ITokenModel extends Document, OAuth2Server.Token {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
    scope: string | string[];
    user: IUserModel | Types.ObjectId | OAuth2Server.User;
}

const TokenSchema: Schema = new Schema({
    accessToken: {
        type: String,
        required: true,
    },
    accessTokenExpiresAt: {
        type: Date,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    refreshTokenExpiresAt: {
        type: Date,
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

export default connections.db.model< ITokenModel >('TokenModel', TokenSchema);
