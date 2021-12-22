import CardDeck from "./CardDeck.js"
import GraphCreator from "./GraphCreator.js"

export default class Bot {

    constructor(game, cards, deck){
        this.game = game
        this.cards = cards
        this.deck = deck
        this.worth = ["10", "B", "D", "K", "T"]
    }

    makeStep() {
        if(this.deck !=0) {
            return this._lowInfo()
        } else {
            const  opponent = []
            
            for(let card of new CardDeck().getDeck){
                let exist = false
                for(let other of this.cards) {
                    if(other.suit == card.suit && other.rank == card.rank) {
                        exist= true
                        break
                    }
                }
                if(!exist){
                    opponent.push(card)
                }
            }
           
            const graph = new GraphCreator({gamerHand:[...opponent],opponentHand:[...this.cards]},3,this.game)
            this._pruning(graph.getGraph, -Infinity, Infinity)
           
            for(let child = 0; child < graph.getGraph.child.length; child++) {
                if(graph.getGraph.child[child].number == graph.getGraph.number) {
                    let node = graph.getGraph.child[child]
                    
                    for(let card of this.cards) {
                       
                        if(card.suit == node.pick.suit && card.rank == node.pick.rank) {
                            console.log("Ss")
                            return this.cards.indexOf(card)
                        }
                    }
                }
            }
        }
    }

    _pruning(graph, alpha, beta) {
        let value = graph.number
        for(let child of graph.child) {
            let newValue = this._pruning(child,alpha, beta)
            if(graph.type == "min" && newValue < value) {
                value = newValue
                beta = value
            } else if (graph.type == "max" && newValue > value) {
                value = newValue
                alpha = value
            }
            if(alpha >= beta) {
                break
            }
            
        }
        
        graph.setnumber = value
        
        return value
    }

    _lowInfo() {
        if(!this.game.currCard) {
            const suits = new Map()
            for(let i of this.cards) {
                if(!suits.get(i.suit)){
                        suits.set(i.suit, 1)
                } else {
                        suits.set(i.suit, suits.get(i.suit) + 1)
                }
            }
            let max = 0
            let curr = ""
            for(let i of suits.keys()) {
                if(suits.get(i) > max) {
                    max = suits.get(i)
                    curr = i
                }
            }
            
            if(max > 1) {
                let min = null
                for(let i of this.cards) {
                    if(i.suit == curr && !min) {
                        min = i
                    } else if(i.suit == curr && min.compare(i) == 1){
                        min = i
                    }
                }
                
                return this.cards.indexOf(min)
            } else {
                this._giveMin()
            }
        } else {
            const exist = []
            for(let card of this.cards) {
                if(exist.includes(card.suit)) {
                    continue
                }
                exist.push(card.suit)
            }
            
            if(!(exist.includes(this.game.currCard.suit))){
                
                return this._tryPick(this.game.currCard)
            } else if (this.worth.includes(this.game.currCard.rank)) {
                
                return this._tryPick(this.game.currCard)
            } else {
                
                return this._giveMin(this.game.currCard)
            }
        }
    }

    _tryPick(card) {
        let posibility = []
        for(let i of this.cards) {
            if(i.compare(card) == 1) {
                posibility.push(i)
            }
        } 
        if(posibility.length == 0) {
            return this._giveMin(this.game.currCard)
        }
        let min = posibility[0]
        for(let i of posibility) {
            if(i.compare(min) == -1) {
                min = i
            }
        }
        return this.cards.indexOf(min)
    }


     _giveMin(curr) {
        let min = null
        if(this.deck != 0) {
            for(let card of this.cards) {
                if(card.compare(curr) != 0 && !min) {
                    min = card
                } else if (card.compare(min)==-1) {
                    min = card
                }
            }
            const posibility = []
            for(let card of this.cards) {
                if(!min && !this.worth.includes(card.rank)) {
                    min = card
                } else {
                    posibility.push(card)
                }
            }
            let temp = posibility[0]
            for(let card of posibility) {
                if(!min && card.compare(temp) == -1) {
                    temp = card
                }
            }
            if(!min) {
                min = temp
            }
            return this.cards.indexOf(min)
        }
        for(let card of this.cards) {
            if(!this.worth.includes(card)) {
                return this.cards.indexOf(card)
            }
        }
     }
}