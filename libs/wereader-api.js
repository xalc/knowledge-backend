import { BOOK_SHELF_URL, READING_TIMES, we_readerCookies } from "./constant.js";

import Singleton from "./MyFetch.js";


export const getShelf = async (syncId) => {

    const parameters = new URLSearchParams({
        synckey: syncId,
        teenmode: 0,
        album: 1,
        onlyBookid: 0
    });

    return await Singleton.request(BOOK_SHELF_URL + '?' + parameters.toString());

}


export const getWrReadingTimes = async (syncId) => {
    const readingTimeURL = `${READING_TIMES}?synckey=${syncId}`;
    return await Singleton.request(readingTimeURL);
}