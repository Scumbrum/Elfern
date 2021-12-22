import CardDeck from "./CardDeck.js"
import Node from "./Node.js"

export default class GraphCreator {
    constructor(value, depth, game) {
        this.depth = depth
        this.value = value
        this.number = 0
        this.begin = new Node(value,null,"min")
        this._create(this.begin, depth, game)
        this.all = new CardDeck().getDeck
    }
    
    _create(node,depth, situation) {

        if(depth == 0) {
            
            situation._countScore("right", node.value.gamerHand)
            situation._countScore("left", node.value.opponentHand)
            
            node.setnumber = situation.gamerScore - situation.opponentScore

            return
        }

        let stop = false
        let row = []
        if(node.type == "min") {
            row = node.value.opponentHand
        } else {
            row = node.value.gamerHand
        }
            for(let i = 0; i<row.length; i++) {
                try {
                    const newSit = situation.copy()
                    const prev = node.value.opponentHand
                    let cards = {}
                    let newType = ""
                    if(node.type == "min"){
                        cards = newSit.opponentStep(i, [...node.value.opponentHand], [...node.value.gamerHand], [])
                        newType = "max"
                    }   else {
                        cards = newSit.gamerStep(i, [...node.value.gamerHand], [...node.value.opponentHand], [])
                        newType = "min"
                    }
                    
                    
                    const newChild = new Node({gamerHand:cards.gamer,
                        opponentHand:cards.opponent},
                        node, newType)
                        newChild.pick = row[i]
                      
                    node.addChild(newChild)
                    if(newSit.gamerScore >= 10 || newSit.opponentScore >= 10) {
                        node.setnumber = newSit.gamerScore - newSit.opponentScore
                        continue
                    }
                    this._create(newChild, depth - 1, newSit)
                } catch (e) {
                    //console.log(i, row.length)
                }
            }
        }
        get getGraph() {
            return this.begin
        }
}
