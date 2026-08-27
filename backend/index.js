import eventEmitter from "events";

const myEventEmitter = new eventEmitter();

myEventEmitter.on("greet",(name) => {
    console.log(`Hello ${name}`)
})
myEventEmitter.emit('greet','Venkita');

class myCustomEmitter extends eventEmitter{
    constructor(){
        super();
        this.greeting = 'Hello';
    }
    greet(name){
        this.emit('greeting',`${this.greeting},${name}`)
    }
}
const mycustomemitter = new myCustomEmitter();
mycustomemitter.on("greeting",input=>{
    console.log('Emitter',input)
})
mycustomemitter.greet("Subramony");

