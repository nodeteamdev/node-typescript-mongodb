import { Document, Schema } from 'mongoose';
import * as OAuth2Server from 'oauth2-server';
import * as connections from '../connection/connection';

/**
 * @export
 * @interface IClientModel
 * @extends {Document}
 */
export interface IClientModel extends Document, OAuth2Server.Client {
    id: string;
}

const ClientSchema: Schema = new Schema({
    id: {
        type: String,
    },
    secret: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['confidential', 'public'],
        default: 'confidential',
    },
    redirectUris: {
        type: Array,
        required: true,
    },
    grants: {
        type: Array,
        required: true,
    },
    key: {
        type: String,
    },
});

export default connections.db.model< IClientModel >('ClientModel', ClientSchema);
