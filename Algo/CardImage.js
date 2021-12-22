import Card from "./Card.js"
import CardDeck from "./CardDeck.js"

let imageMap =  new Map()
for(let card of new CardDeck().getDeck) {
    imageMap.set(card.rank+card.suit,card.rank+card.suit+".png")
}
imageMap.set("NN","None.png")
export default imageMap