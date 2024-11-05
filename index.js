import { initDb } from "./src/initMongo.js";
import { syncWeReader } from "./src/SyncWeReader.js";

//TODO some condition to init db or not do init
// await initDb();
// await syncWeReader();

// Test internet connection
// inside wsl offce throw below error
// so try to move out

// node: internal / deps / undici / undici: 13185
// Error.captureStackTrace(err);
//             ^
// TypeError: fetch failed
//     at node:internal/deps/undici/undici:13185:13
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async getCredly (file:///home/xalc/Documents/coding/nodejs/knowledge-backend/index.js:16:22) {
//   [cause]: ConnectTimeoutError: Connect Timeout Error
//       at onConnectTimeout (node:internal/deps/undici/undici:2331:28)
//       at node:internal/deps/undici/undici:2283:50
//       at Immediate._onImmediate (node:internal/deps/undici/undici:2315:13)
//       at process.processImmediate (node:internal/timers:483:21) {
//     code: 'UND_ERR_CONNECT_TIMEOUT'
//   }

const getCredly = async (url) => {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
}
getCredly('https://www.credly.com/users/xalc')
    .then((response) => {
        console.error(response)
    }).catch(error => {
        getCredly('https://www.credly.com/users/xalc');
        console.trace(error);
    });