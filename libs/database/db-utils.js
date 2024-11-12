import MongoDBManager from "./DBInstance.js";

const userName = process.env.MONGO_USERNAME;
const pwd = process.env.MONGO_PASSWORD;
const address = process.env.MONGO_ADDR;
const port = process.env.MONGO_PORT;


import {
    READING_TIMES_COLLECTION,
    WE_READER_DB_NAME,
    SYNC_HISTORY_COLLECTION, BOOKS_C, BOOK_PROGRESS_C
} from '../constant.js'
export const getDbString = () => `mongodb://${userName}:${pwd}@${address}:${port}`;


export const getSyncId = async (key) => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        const result = await dbInstance.findOne(SYNC_HISTORY_COLLECTION, {
            keyName: key,
        });
        let syncId = 0;
        if (result !== null) {
            syncId = result.keyValue;
        }
        await dbInstance.disconnect();
        return syncId;
    } catch (error) {
        console.error(`get syncId for ${key} failed:  ${error}`);
        throw (error);
    }
}
export const updateSyncId = async (key, value) => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        const result = await dbInstance.updateOne(SYNC_HISTORY_COLLECTION, {
            keyName: key,
        }, {
            $set: {
                keyValue: value
            }

        });
        await dbInstance.disconnect();
        return result;
    }
    catch (error) {
        console.error(`set syncId for ${key} failed:  ${error}`);
        throw (error);
    }
}
export const updateReadingTimes = async (documents) => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        const result = await dbInstance.insertMany(READING_TIMES_COLLECTION, documents);
        await dbInstance.disconnect();
        return result;
    } catch (error) {
        console.error(`Sync Reading data failed:  ${error}`);
        throw (error)
    }
}
export const getDBReadingTimes = async () => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        const result = await dbInstance.findMany(READING_TIMES_COLLECTION, {});
        await dbInstance.disconnect();
        return result;

    } catch (error) {
        console.error(`Get Reading data failed:  ${error}`);
        throw (error)
    }
}

export const updateBookShelf = async (documents) => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        let [total, replace, insert] = [documents.length, documents.length,0];
        for (const doc of documents) {
            const id = doc.bookId;
            const replacement = await dbInstance.replaceOne(BOOKS_C,{_id: id}, {
                _id: id,
                ...doc
            });
            if(replacement === null) {
                replace--;
                await dbInstance.insertOne(BOOKS_C,{
                    _id: id,
                    ...doc
                })
                insert++;
            }
        }
        await dbInstance.disconnect();
        return [total, replace, insert];
    } catch (error) {
        console.error(`Sync Reading data failed:  ${error}`);
        throw (error)
    }
}
export const updateBookProgress = async (documents) => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        let [total, replace, insert] = [documents.length, documents.length,0];
        for (const doc of documents) {
            const id = doc.bookId;
            const replacement = await dbInstance.replaceOne(BOOK_PROGRESS_C,{_id: id}, {
                _id: id,
                ...doc
            });
            if(replacement === null) {
                replace--;
                await dbInstance.insertOne(BOOK_PROGRESS_C,{
                    _id: id,
                    ...doc
                })
                insert++;
            }
        }
        await dbInstance.disconnect();
        return [total, replace, insert];
    } catch (error) {
        console.error(`Sync Reading data failed:  ${error}`);
        throw (error)
    }
}