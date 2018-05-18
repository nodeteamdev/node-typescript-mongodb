import * as mongoose from 'mongoose';

export default class Connection {
    static init() :void {
        const MONGO_URI: string = 'mongodb://localhost:27017/users';

        mongoose.connect(MONGO_URI || process.env.MONGODB_URI);
    }
}
