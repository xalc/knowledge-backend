import { getReadingTimes } from '../libs/wereader-api.js';
import {getSyncId, updateReadingTimes,updateSyncId} from "../libs/db-utils.js";

const syncReadingTimes = async () => {
    const syncId = await getSyncId('readingTime').catch(error => {throw(error)});
    const result = await getReadingTimes(syncId).catch(error => {throw(error)});
    const { registerTime, synckey, readTimes }= result;

    const documents = [];
    for (let [key, value] of Object.entries(readTimes)) {
        const document = {
            timeStamp: key,
            second: value
        }
        documents.push(document);
    }
    if(documents.length > 0) {
        documents.sort((item1, item2) => item1.timeStamp - item2.timeStamp)
        const updatedResult = await updateReadingTimes(documents).catch(error => {throw(error)});
        await updateSyncId('readingTime', synckey).catch(error => {throw(error)});
        await updateSyncId('registerTime', registerTime).catch(error => {throw(error)});
        return updatedResult;
    }
    return {
        acknowledged: true,
        insertedCount: 0
    }



}

export const syncWeReader = async() => {
    try {
        const updatedResult = await syncReadingTimes();
        if(updatedResult.acknowledged) {
            console.log(`${updatedResult.insertedCount} item is added`);
        }
    } catch(error) {
        console.error('Sync we reader error: '+ error)
    }



}