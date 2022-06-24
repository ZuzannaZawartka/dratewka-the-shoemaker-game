import Command from "./Command.js";

class Commands {
    constructor(com) {
        this.map = [];
        this.generateCommands(com)
    }

    generateCommands(com) {
        com.forEach(e => {
            let { name, alias, type, value } = e
            this.map.push(new Command(name, alias, type, value));
        })
    }

}




export default Commands;



