export default class Node {
    constructor(value, parent, type = "min") {
        this.value = value
        this.child = []
        this.parent = parent
        this.type = type
        
        this.number = type == "min" ? Infinity : -Infinity
    }
    addChild(node) {
        this.child.push(node)
    }

    set setnumber(number){
        this.number = number
    }

    get getnumber() {
        return this.number
    }
}