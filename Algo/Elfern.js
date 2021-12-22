import CardDeck from "./CardDeck.js"
export default class Elfern {
    constructor (limit) {
        this.limit = limit
        this.count = 0
        this.queue = new Map()
        this.currCard = null
        this.opened = []
        this.gamerScore = 0
        this.opponentScore = 0
    }

    setFirst() {
        const gamerCards = []
        const opponentCards = []
        if(this.queue.size!=0) {
            return
        }
        const rand = Math.random()
        if(rand > 0.5) {
            this.queue.set("right", 1)
            this.queue.set("left", 0)
        } else {
            this.queue.set("left", 1)
            this.queue.set("right", 0)
        }
        const deck = new CardDeck().getDeck
        
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 3; j++) {
                const index =Math.floor(Math.random() * deck.length)
                
                if(i % 2==0 && rand > 0.5 || i % 2==1 && rand <= 0.5) {
                    gamerCards.push(deck[index])
                
                } else {
                    opponentCards.push(deck[index])
                }
                deck.splice(index,1)
            }
        }
        return {
            gamer:gamerCards,
            opponent:opponentCards,
            deck:deck
        }
    }

    _checkStep(gamer,card) {
        if(!(this.count%2 == this.queue.get(gamer))) {
            throw new Error("Not your step")
        }
    }

    _tryPush(card) {     
        if(!card) {
            return
        } 
        for(let i = 0 ; i < this.opened.length; i++) {
            if(this.opened[i].suit == card.suit && this.opened[i].rank == card.rank) {
                return
            }
        }
        this.opened.push(card)
    }
    
    _checkOver(gamer, opponent) {
        if(gamer.length == 0 || opponent.length == 0) {
            this.over = true
        } else if(this.gamerScore >= this.limit || this.opponentScore == this.limit) {
            this.over = true
        } else if (this.over) {
            throw new Error("End game")
        }
        if(!this.over){
            return
        }
        this._countScore("right",gamer)
        this._countScore("left",opponent)
        if(this.gamerScore > this.opponentScore) {
            this.win = "Right"
        } else if(this.gamerScore < this.opponentScore) {
            this.win = "Left"
        } else {
            this.win = "Draw"
        }
    }

    _checkPart() {
        if(this.count == 24) {
            return true
        }
        return false
    }

    _countScore(gamer, gamerCards){
        const worthCard = ["10", "B", "D", "K", "T"]
        let score = 0
        
        for(let card of gamerCards) {
            if(worthCard.includes(card.rank)) {
                score++        
            }
        }
        if(score > 10) {
            if(score == 20) {
                score = 5
            } else if (18<=score && score<=19) {
                score = 4
            } else if(16<=score && score <=17) {
                score = 3
            } else if (14<=score && score<=15) {
                score = 2
            } else {
                score = 1
            }
        } else {
            score = 0
        }
        if(gamer == "right") {
            this.gamerScore += score
        } else {
            this.opponentScore += score
        }
    }


    _reload(gamerCards,opponentCards) {
        this._countScore("right",gamerCards)
        this._countScore("left",opponentCards)
        this.count = 0
    }

    _tryStep(right, left, deck, index) {
        if(this.currCard && deck !=0) {
            let exists = false
            for(let i of right) {
                if(i.suit == this.currCard.suit) {
                    exists = true
                    break
                }
            }
            if(exists && right[index].suit!=this.currCard.suit) {
                throw new Error("Drop another card")
            }
        }

        if(this.currCard != null) {
            if(right.length == 0) {
                return
            }
            if(right[index].suit != this.currCard.suit) {
                left.push(right[index])
                left.push(this.currCard)
                right.splice(index,1)
            } else if(right[index].compare(this.currCard) == -1) {
                left.push(right[index])
                left.push(this.currCard)
                right.splice(index,1)
            } else {
                right.push(this.currCard)
            }
            this.currCard = null
        } else {
            this.currCard = right[index]
            right.splice(index,1)
        }
    }

    _pickCards(deck,gamerCards,opponentCards) {
        if(deck.length == 0 || this.count%2 == 0) {
            return
        }
        

        let index = Math.floor(Math.random() * deck.length)

        if(this.queue.get("right") == 1) {
            gamerCards.push(deck[index])
            deck.splice(index,1)
            index = Math.floor(Math.random() * deck.length)
            opponentCards.push(deck[index])
            deck.splice(index,1)
        } else {
            opponentCards.push(deck[index])
            deck.splice(index,1)
            index = Math.floor(Math.random() * deck.length)
            gamerCards.push(deck[index])
            deck.splice(index,1)
        }

    }

    gamerStep(index, gamerCards, opponentCards, deck) {
        this._checkStep("right", gamerCards[index])
        
        this._tryStep(gamerCards, opponentCards, deck, index)
       

        this._pickCards(deck,gamerCards,opponentCards)
        

        if(this._checkPart()) {
            this._reload(gamerCards, opponentCards)
        }

        this._checkOver(gamerCards,opponentCards)

        this._tryPush(gamerCards[index])
        
        this.count++
         
        return {gamer:gamerCards,
        opponent:opponentCards,
        deck:deck,
        reload:false}
        }

    opponentStep(index, opponentCards, gamerCards, deck) {

        this._checkStep("left",opponentCards[index])

        this._tryStep(opponentCards, gamerCards, deck, index)
        
        this._pickCards(deck, gamerCards,opponentCards)

        if(this._checkPart()) {
            this._reload(gamerCards,opponentCards)
        }

        this._checkOver(gamerCards,opponentCards)

        this.count++
        this._tryPush(opponentCards[index])

        return {gamer:gamerCards,
            opponent:opponentCards,
            deck:deck,
            reload:false}
    }

    get getQueue() {
        for(let i of this.queue.keys()) {
            if(this.queue.get(i) === this.count % 2) {
                return i
            }
        }
    }

    get getOver() {
        return this.over
    }

    copy() {
        const clone = new Elfern(this.limit)
        clone.count = this.count
        clone.queue.set("right", this.queue.get("right"))
        clone.queue.set("left", this.queue.get("left"))
        clone.gamerScore = this.gamerScore
        clone.opponentScore = this.opponentScore
        clone.currCard = this.currCard
        return clone
    }
}
