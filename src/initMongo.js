import {initBookDocument, initSynckeyDocument} from '../libs/database/db-init-utils.js'

export const initDb = async() => {


    await initSynckeyDocument().catch(error => {
        console.log(`error occured!!! ${error}`)
    });
    console.log('init we reader database successfully.')


    // await initBookDocument()

}