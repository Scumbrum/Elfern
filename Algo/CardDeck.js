import Card from "./Card.js"

export default class CardDeck {
    get getDeck() {
        const figures = ["6", "7", "8", "9", "10", "B", "D", "K", "T"]
        const suit = ["B", "P", "C", "H"]
        const deck = []
        for(let i of figures) {
            for(let j of suit) {
                deck.push(new Card(j, i))
            }
        }
        return deck
    }
}