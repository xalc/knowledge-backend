import { initDb } from "./src/initMongo.js";
import { syncWeReader } from "./src/SyncWeReader.js";
import {we_readerCookies, WEREAD_URL} from "./libs/constant.js";
import tryQuiz from './Quiztime/tryquiz.js'
//TODO some condition to init db or not do init
// await initDb();
await syncWeReader();

// tryQuiz();