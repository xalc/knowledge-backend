import MongoDBManager from "../database/DBInstance.js";
import {getDbString} from "../libs/db-utils.js";



const initSynckeyDocument = async () => {
    try {
        const dbInstance = new MongoDBManager(getDbString(),'wereader');
        await dbInstance.connect();
        await dbInstance.insertOne('sync_history', {
            keyName: 'readingTime',
            keyValue: 0
        });
        await dbInstance.insertOne('sync_history', {
            keyName: 'registerTime',
            keyValue: 0
        });
        await dbInstance.disconnect();

    } catch(error) {
        console.error('init sync database failed: ' + error);
        throw(error);
    }
}


export const initDb = async() => {
    initSynckeyDocument().then(result => {
        console.log('init we reader database successfully.');
    }).catch(error => {
        console.log(`error occured!!! ${error}`)
    });

}