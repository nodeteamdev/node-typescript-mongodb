import * as jwt from 'express-jwt';

const getTokenFromHeaders: any = (req: any): any => {
    const { headers: { authorization } }: any = req;

    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }

    return null;
};

const auth: any = {
    required: jwt({
        secret: 'secret',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'secret',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

export default auth;
