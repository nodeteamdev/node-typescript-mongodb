import * as dotenv from 'dotenv';
dotenv.config();
/**
 * @interface IConfig
 */
interface IConfig {
    port: string | number;
    database: {
        MONGODB_URI: string;
        MONGODB_DB_MAIN: string;
    };
    secret: string;
}

const NODE_ENV: string = process.env.NODE_ENV || 'DEV';

const DEV: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'users_db'
    },
    secret: process.env.SECRET || '@QEGTUI'
};

const PROD: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://production_uri/',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN  || 'users_db'
    },
    secret: '@QEGTUI'
};

const config: {[name: string]: IConfig} = {
    DEV, PROD
};

export default config[NODE_ENV];
