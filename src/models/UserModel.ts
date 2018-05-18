import { model, Schema } from 'mongoose';

const LightboxSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    {
        collection: 'usermodel',
        versionKey: false
    },
);

export default model('UserModel', LightboxSchema);
