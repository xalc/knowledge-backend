import MongoDBManager from "./DBInstance.js";

const userName = process.env.MONGO_USERNAME;
const pwd = process.env.MONGO_PASSWORD;
const address = process.env.MONGO_ADDR;
const port = process.env.MONGO_PORT;

const onlineDB = process.env.USE_ATLAS_DATABASE;
const atlasName = process.env.ATLAS_NAME;
const atlasPD = process.env.ATLAS_PD;
const cluster = process.env.ATLAS_CLUSTER;

import {
    READING_TIMES_COLLECTION,
    WE_READER_DB_NAME,
    SYNC_HISTORY_COLLECTION, BOOKS_C,
    BOOK_PROGRESS_C,
    COOKIES_TOKENS
} from '../constant.js'

export const getDbString = () => {
    let dbaddr = '';

    if (onlineDB === 'true') {
        dbaddr = `mongodb+srv://${atlasName}:${atlasPD}@${cluster}?retryWrites=true&w=majority&appName=Cluster0`
    } else {
        dbaddr = `mongodb://${userName}:${pwd}@${address}:${port}`;
    }

    return dbaddr;

};

export const getDBAddr = () => {
    if (onlineDB === 'true') {
        return `mongodb+srv://${cluster}?retryWrites=true&w=majority&appName=Cluster0`
    } else {
        return `mongodb://${address}:${port}`;

    }

}

export const getCookies = async () => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        const result = await dbInstance.findOne(SYNC_HISTORY_COLLECTION, {
            keyName: COOKIES_TOKENS,
        });
        let cookies = '';
        if (result !== null) {
            cookies = result.keyValue;
        }
        await dbInstance.disconnect();
        return cookies;
    } catch (error) {
        console.error(`get weread token failed:  ${error}`);
        throw (error);
    }
}

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
export const insertReadingTimes = async (documents) => {
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
export const updateReadingTimes = async (record) => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        const result = await dbInstance.updateOne(READING_TIMES_COLLECTION, {
            _id: record._id,
        }, {
            $set: {
                readingSeconds: record.readingSeconds
            }

        });
        await dbInstance.disconnect();
        return result;
    } catch (error) {
        console.error(`Update reading record:  ${error}`);
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
        let [total, replace, insert] = [documents.length, documents.length, 0];
        for (const doc of documents) {
            const id = doc.bookId;
            const replacement = await dbInstance.replaceOne(BOOKS_C, { _id: id }, {
                _id: id,
                ...doc
            });
            if (replacement === null) {
                replace--;
                await dbInstance.insertOne(BOOKS_C, {
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
        let [total, replace, insert] = [documents.length, documents.length, 0];
        for (const doc of documents) {
            const id = doc.bookId;
            const replacement = await dbInstance.replaceOne(BOOK_PROGRESS_C, { _id: id }, {
                _id: id,
                ...doc
            });
            if (replacement === null) {
                replace--;
                await dbInstance.insertOne(BOOK_PROGRESS_C, {
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