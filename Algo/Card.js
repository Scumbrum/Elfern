export default class Card {
    constructor (suit, rank) {
        this.suit = suit
        this.rank = rank
    }

    compare(card) {
        if(card==null || card.suit!=this.suit){
            return 0
        }
        let figures = ["6", "7", "8", "9", "10", "B", "D", "K", "T"]   
        if(figures.indexOf(card.rank) > figures.indexOf(this.rank)) {
            return -1
        } else {
            return 1
        }
    }
}