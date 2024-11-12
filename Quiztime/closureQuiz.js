const simplest = () => {
    let count = 3;
    let instance = null
    console.log('outer');
    return () => count;
}
const closer = () => {
    // let c = simplest();
    // console.log(c());

    // let instance1 = Singleton().getInstance('1','H');
    // let instance2 = Singleton().getInstance('2','W');
    // console.log(instance1 === instance2);
    // console.log(instance2.value);
    // return false ,w

    // let instance1 = SingletonInstance.getInstance('1','H');
    // let instance2 = SingletonInstance.getInstance('2','W');
    // console.log(instance1 === instance2);
    // console.log(instance2.value);
    // return true ,H


    currying();
}


const Singleton = () => {
    let instance = null
    const Instance = function(name, value) {
        this.name = name;
        this.value = value;
    }
    return {
        getInstance: (name, value) =>{
            if(instance) {
                return instance;
            }
             instance = new Instance(name, value);
            return instance;
        }
    }
}
const SingletonInstance = Singleton();

//柯里化Currying

const currying = () => {
    const add = (x,y,z) => x+y+z;
    const add5 = (x,y) => () => add(x,y,5);
    console.log(add5(6,7)())
    const addSome = (any) => (x,y) =>add(x,y,any)
    console.log(addSome(5)(6,7))
    const separateAdd = (x) => (y) => (z) => add(x,y,z);
    console.log(separateAdd(5)(6)(7))
}
// 对任意函数
let func = (x,y,z) => x+y+z;
const CurryingFuc = (func) => {
    return (args) => {
        let first = args[0];
        let rest = [first,...args];
        func()
    }
}





export default  closer;