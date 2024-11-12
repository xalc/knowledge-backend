const tryQuiz =  async() => {
    // try {
    //     simulatorFetch().then((result) => {
    //         console.log(`resolve: value=` + result?.value);
    //     }).catch(err => {
    //             console.error(`inside await catch ${err.error}`);
    //             // throw err;
    //         });
    //
    // } catch (e) {
    //     console.error(`try catch e: ${e.error}`)
    // }
    // simplest();
    // circuitThrow();
    const result = await simulatorFetch().then(result => {
        console.log('then: ' + result?.value);
        return result?.value + 1;
    }).catch(e => {
        console.error(`catch e: ${e.error}`)
    });
    console.log(result)

}
const simulatorFetch = () => new Promise((resolve, reject) => {
            setTimeout(
                () => {
                    try{
                        getDelayValue();
                    }catch(e) {
                        console.error(`catch setTimeout error(threw by getDelayValue): ${e}`)
                    }
                }
                ,1000);

            const getDelayValue = () => {
                const randomValue = Math.random();
                console.log(`random value ${randomValue}`)

                if(randomValue> 0.97) {
                    resolve({ value : randomValue })
                    console.log('after resolve')
                } else if(randomValue>0.05) {
                    reject({error: randomValue})
                    console.log('after reject')
                } else
                    throw new Error('other')
            }
})

const simplest = () => {
    try {
        throw new Error("Whoops!");
    } catch (e) {
        console.error(`${e.name}: ${e.message}`);
    }
}

const circuitThrow = () => {
    try {
        circuit1();
    } catch(err) {
        console.error(`${err.name}: ${err.message}`);
    }
}
const circuit1 = () => {
    console.log('execute circuit1');
    circuit2()
    console.log('execute circuit1 end');
}
const circuit2 = () => {
    console.log('execute circuit2');
    throw new Error('circuit2');
}


export default tryQuiz;