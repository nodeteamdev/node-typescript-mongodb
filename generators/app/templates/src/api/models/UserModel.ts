import * as connections from '../config/connection/connection';
import { Document, Schema, Types } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IUserModel extends Document {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    facebook: string;
    tokens: AuthToken[];

    profile: {
        name: string,
        gender: string,
        location: string,
        website: string,
        picture: string
    };
    comparePassword: comparePasswordFunction;
    gravatar: (size: number) => string;
}

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

export type AuthToken = {
    accessToken: string,
    kind: string
};

const UserSchema: Schema = new Schema({
    email: String,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    tokens: Array,
}, {
    collection: 'usermodel',
    versionKey: false
}).pre('save', function (next: any): any {
    const user: any = this; // tslint:disable-line
    
    if (!user.isModified('password')) { return next(); }

    bcrypt.genSalt(10, (err:any, salt:any) => {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, undefined, (err: any, hash:any ) => {
            if (err) { return next(err); }

            user.password = hash;
            next();
        });
    });
});

const comparePassword: any = function (candidatePassword: any, cb: any): any {
    bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

UserSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
UserSchema.methods.gravatar = function (size: number):any {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5:any = crypto.createHash('md5').update(this.email).digest('hex');

    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};


export default connections.db.model< IUserModel >('UserModel', UserSchema);
