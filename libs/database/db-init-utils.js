import MongoDBManager from "./DBInstance.js";
import {getDbString} from "./db-utils.js";
import {
    BOOK_PROGRESS_C,
    BOOKS_C,
    READING_TIME_SYNC_KEY,
    REGISTER_TIME_KEY,
    SYNC_HISTORY_COLLECTION,
    WE_READER_DB_NAME,
    BOOKS_SYNC_KEY
} from '../constant.js'
export const initSynckeyDocument = async () => {
    try {
        const dbInstance = new MongoDBManager(getDbString(),WE_READER_DB_NAME);
        await dbInstance.connect();
        await dbInstance.insertOne(SYNC_HISTORY_COLLECTION, {
            keyName: READING_TIME_SYNC_KEY,
            keyValue: 0
        });
        await dbInstance.insertOne(SYNC_HISTORY_COLLECTION, {
            keyName: REGISTER_TIME_KEY,
            keyValue: 0
        });
        await dbInstance.insertOne(SYNC_HISTORY_COLLECTION, {
            keyName: BOOKS_SYNC_KEY,
            keyValue: 0
        });
        await dbInstance.disconnect();

    } catch(error) {
        console.error('init sync database failed: ' + error);
        throw(error);
    }
}

export const initBookDocument = async () => {
    try {
        const dbInstance = new MongoDBManager(getDbString(),WE_READER_DB_NAME);
        await dbInstance.connect();

        await dbInstance.createCollection(BOOKS_C);

        await dbInstance.createCollection(BOOK_PROGRESS_C);
        await dbInstance.disconnect();

    } catch (error) {
        console.error('init books and books progress:  failed' + error);
        throw(error);
    }


}