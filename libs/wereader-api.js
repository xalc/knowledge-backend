import { WEREAD_URL, BOOK_SHELF_URL, READING_TIMES, we_readerCookies } from "./constant.js";
import MyFetch from "./MyFetch.js";




export const getShelt = async () => {
    // synckey=1730013368&teenmode=0&album=1&onlyBookid=0

    const parameters = new URLSearchParams({
        synckey: 0,
        teenmode: 0,
        album: 1,
        onlyBookid: 0
    });
    return await fetchWithCookie(BOOK_SHELF_URL + '?' + parameters.toString());
}


export const getWrReadingTimes = async (syncId) => {
    const myFetch = new MyFetch();
    const cookies = await myFetch.syncCookies(WEREAD_URL);
    console.log(cookies);
    const readingTimeURL = `${READING_TIMES}?synckey=${syncId}`;
    return await myFetch.request(readingTimeURL);
}