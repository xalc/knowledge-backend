import MongoDBManager from "../database/DBInstance.js";

const userName = process.env.MONGO_USERNAME;
const pwd = process.env.MONGO_PASSWORD;
const address = process.env.MONGO_ADDR;
const port = process.env.MONGO_PORT;
console.log(`port ${port}`)
const WE_READER_DB_NAME = 'wereader';
export const getDbString = () => `mongodb://${userName}:${pwd}@${address}:${port}`;


export const getSyncId = async (key) => {
    try {
        const dbInstance = new MongoDBManager(getDbString(), WE_READER_DB_NAME);
        await dbInstance.connect();
        const result = await dbInstance.findOne('sync_history', {
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
        const result = await dbInstance.updateOne('sync_history', {
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
        const result = await dbInstance.insertMany('readtimes', documents);
        await dbInstance.disconnect();
        return result;
    } catch (error) {
        console.error(`Sync Reading data failed:  ${error}`);
        throw (error)
    }
}