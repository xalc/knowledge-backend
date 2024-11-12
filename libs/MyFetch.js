import {we_readerCookies, WEREAD_URL} from "./constant.js";
import {default as Cookie } from 'cookie';

class MyFetch {
    constructor() {
        this.headers = new Headers({
            "cookie": we_readerCookies,
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'Content-type': 'application/json'
        });
        this.cookie = we_readerCookies;
    }

    init () {

    }
    getHeader() {
        return this.headers;
    }
    updateHeaderCookie(cookie) {
        const old = Cookie.parse(this.cookie);
        const newCookie = Cookie.parse(cookie);

        console.log(`cookies key: ${newCookie.wr_skey}` )
        this.headers.set('cookie', this.cookie.replace(old.wr_skey, newCookie.wr_skey));
    }
    async syncCookies(url) {
        const response = await fetch(url, {
            headers: this.getHeader(),
            credentials: 'include',
            redirect: "follow"
        });
        if (!response.ok) {
            throw new Error(`fetch URL ${url} failed with : + ${response.statusText}`)
        }
        const cookie = response.headers.get('Set-Cookie');

        this.updateHeaderCookie(cookie);
        return cookie;
    }
    async request(url) {
        const response = await fetch(url,{
            headers: this.getHeader(),
            credentials: 'include',
            redirect: "follow"
        });
        if (!response.ok) {
            throw new Error(`fetch URL ${url} failed with : + ${response.statusText}`)
        }
        console.log(`fetch URL ${url} succeed`);

        return await response.json();
    }

}
const fetchInstance = async() => {
    const fetch = new MyFetch();
    await fetch.syncCookies(WEREAD_URL);
    return  () => fetch;

}
//When the project initial , the fetchInstance is executed,this should improve.
const Singleton = (await fetchInstance())();
// const Singleton = await fetchInstance();
export default Singleton;