import { WEREAD_URL, BOOK_SHELF_URL, READING_TIMES, we_readerCookies } from "./constant.js";

const getHeaders = () => {
    return {
        'cookie': we_readerCookies,

    }
}

const fetchWithCookie = async (url) => {

    const response = await fetch(url, {
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error(`fetch URL ${url} failed with : + ${response.statusText}`)
    }
    return await response.json();
}

const getConnect = async () => {
    // request first to valid the cookie
    try {
        await fetch(WEREAD_URL, {
            headers: getHeaders(),
            method: 'get',
            redirect: "follow"
        })
            .then(result => console.log('succeed? ' + result.ok))
            .catch(error => {
                console.log('internal: ' + error)
                throw new Error(`fetch URL ${WEREAD_URL} failed with : + ${error}`)
            });
    } catch (e) {
        console.log('entenal: ' + e)
        throw(e);
    }

}

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


export const getReadingTimes = async (syncid) => {

    await getConnect();
    return await fetchWithCookie(`${READING_TIMES}?synckey=${syncid}`).catch(error => {throw(error)});
}