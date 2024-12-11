import { getShelf, getWrReadingTimes } from '../libs/wereader-api.js';
import {
    getSyncId,
    insertReadingTimes,
    getDBReadingTimes,
    updateSyncId,
    updateBookShelf,
    updateBookProgress,
    getDBAddr,
    updateReadingTimes
} from "../libs/database/db-utils.js";
import { BOOKS_SYNC_KEY, READING_TIME_SYNC_KEY, REGISTER_TIME_KEY } from "../libs/constant.js";

const syncReadingTimes = async () => {
    //seems synckey  not working the same return from we reader...
    const syncId = await getSyncId(READING_TIME_SYNC_KEY);
    console.log(`${READING_TIME_SYNC_KEY}: ${syncId} `);
    const result = await getWrReadingTimes(0);
    const prevReadingTimes = await getDBReadingTimes();
    const { registTime, synckey, readTimes } = result;

    const documents = [];
    //TODO refactor for insert _id>the last one
    for (let [key, value] of Object.entries(readTimes)) {
        let historicalIndex = prevReadingTimes.findIndex((item) => item._id === key)
        if (historicalIndex === -1) {
            const document = {
                _id: key,
                readingSeconds: value
            }
            documents.push(document);
        } else {
            if (value !== prevReadingTimes[historicalIndex].readingSeconds) {
                const document = {
                    _id: key,
                    readingSeconds: value
                }
                updateReadingTimes(document);
            }
        }

    }

    if (documents.length > 0) {
        documents.sort((item1, item2) => item1.timeStamp - item2.timeStamp)
        const updatedResult = await insertReadingTimes(documents);
        if (syncId === 0) {
            await updateSyncId(REGISTER_TIME_KEY, registTime);
        }
        await updateSyncId(READING_TIME_SYNC_KEY, synckey);

        return updatedResult;
    }
    return {
        acknowledged: true,
        insertedCount: 0
    }



}

const syncBooksAndProgress = async () => {
    const syncId = await getSyncId(BOOKS_SYNC_KEY);
    console.log(`${BOOKS_SYNC_KEY}: ${syncId} `);
    const result = await getShelf(syncId);
    const { books, bookProgress, synckey } = result;
    const counts = await updateBookShelf(books);
    console.log(`total new books in shelf: ${counts[0]}, replaced count: ${counts[1]}, inserted count: ${counts[2]}`)
    const progressCounts = await updateBookProgress(bookProgress);
    const [total, replace, insert] = progressCounts;
    console.log(`Update book progress: ${total}, replaced count: ${replace}, inserted count: ${insert}`)

    await updateSyncId(BOOKS_SYNC_KEY, synckey);

}

export const syncWeReader = async () => {
    try {
        console.log(`using database: ${getDBAddr()}`)
        const updatedResult = await syncReadingTimes();
        if (updatedResult.acknowledged) {
            console.log(` Reading time syncing: ${updatedResult.insertedCount} item is added`);
        }
        await syncBooksAndProgress();
    } catch (error) {
        console.error('Sync we reader data: ' + error)
    }



}