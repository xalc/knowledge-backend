import {we_readerCookies} from "./constant.js";
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
        this.url =null;
    }
    setURL(url) {
        this.url = null;
    }
    getURL() {
        return this.url;
    }
    setCookie (cookie) {
        this.cookie = cookie;
    }
    getCookie() {
        return this.cookie;
    }

    getHeader() {
        return this.headers;
    }
    updateHeaderCookie(cookie) {
        const old = Cookie.parse(this.cookie);
        const newCookie = Cookie.parse(cookie);


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
export default MyFetch;