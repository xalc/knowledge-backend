// import { initDb } from "./src/initMongo.js";
import { syncWeReader } from "./src/SyncWeReader.js";

// import startQuiz from "./Quiztime/quiz.js";
import renameAll from "./libs/NotionExporter.js";
//TODO some condition to init db or not do init
// await initDb();
await syncWeReader();


// startQuiz()
// rename notion export markdown file
// renameAll(process.cwd() + '/notes');