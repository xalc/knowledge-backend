import { Cookie, CookieJar } from 'tough-cookie'

const cookiesDemo = async () => {
    const cookieHeaders = 'wr_skey=dzkhaF1g; Max-Age=2592000; Domain=.weread.qq.com; Path=/; Expires=Tue, 24 Dec 2024 09:33:12 GMT; HttpOnly';
    const resCookies = Cookie.parse(cookieHeaders);
    console.log(resCookies)

    const cookieJar = new CookieJar();
    await cookieJar.setCookie(resCookies, 'https://weread.qq.com')
    const matchingCookies = await cookieJar.getCookies('https://weread.qq.com')

    console.log(matchingCookies)

}

export default cookiesDemo;