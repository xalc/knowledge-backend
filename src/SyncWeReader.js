import { getWrReadingTimes } from '../libs/wereader-api.js';
import {getSyncId, updateReadingTimes, getDBReadingTimes, updateSyncId} from "../libs/db-utils.js";
import { READING_TIME_SYNC_KEY} from "../libs/constant.js";

const syncReadingTimes = async () => {
    //seems synckey  not working the same return from we reader...
    const syncId = await getSyncId('READING_TIME_SYNC_KEY');
    const result = await getWrReadingTimes(syncId);
    const prevReadingTimes =  await getDBReadingTimes();
    const { registTime, synckey, readTimes }= result;
    await updateSyncId('READING_TIME_SYNC_KEY', synckey);
    const documents = [];
    //TODO refactor for insert _id>the last one
    for (let [key, value] of Object.entries(readTimes)) {
        if(prevReadingTimes.findIndex((item) => item._id === key)===-1){
            const document = {
                _id: key,
                readingSeconds: value
            }
            documents.push(document);
        }

    }

    if(documents.length > 0) {
        documents.sort((item1, item2) => item1.timeStamp - item2.timeStamp)
        const updatedResult = await updateReadingTimes(documents);
        if(syncId ===0) {
            await updateSyncId('registerTime', registTime);
        }

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