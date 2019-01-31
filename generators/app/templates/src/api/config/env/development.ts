/**
 * development config
 * will replace database config if NODE_ENV === 'development'
 */
export const envConfig: any = {
    database: {
        MONGODB_URI: 'mongodb://localhost:27017/',
        MONGODB_DB_MAIN: 'users_db'
    }
};
