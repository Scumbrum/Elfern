import React from "react"
import ReactDOM from "react-dom"
import Cards from "./Cards.js"
import Open from "./Open.js"
import Deck from "./Deck.js"
export default class Board extends React.Component {
    constructor(props) {
        super(props)
       
        
    }
    

    _generateCard(hand) {
        let currPick = null
        if(this.props.hand == hand && this.props.act =="Pick") {
           currPick = this.props.pick
           
        }

        let cards = null
        if (hand == 0){
            cards = <Cards changer = {this.props.changer} className = "gamer" cards = {this.props.sit.gamer} score = {this.props.gamerScore} pick = {currPick}/>
        }else {
            cards = <Cards  className = "opponent" cards = {this.props.sit.opponent.map((e)=>this.props.sit.opponent.indexOf(e)!=currPick ? null : e)} score = {this.props.oppScore} pick = {currPick}/>
        }
        return cards
    }

    _generateDeck() {
        let currPick = null
        let currHand = null
        if(this.props.act =="distribution") {
            currPick = this.props.pick
            currHand = this.props.hand
        }
        let deck = <Deck className = "deck" cards = {this.props.sit.deck.length} pick ={currPick}hand = {currHand}/>
        
        return deck
    }

    _generateOpen() {
        let currHand = null
        if(this.props.act == "giving") {
            currHand = this.props.hand
        }
        let open = <Open cards = {this.props.open} hand = {currHand}></Open>
        
        return open
    }


    render() {
        
        return(
            <>
            <div className="board">
                {this._generateCard(0)}
                <hr className="vseparator"/>
                <hr className="hseparator"/>
                <div className="center">
                    <div className="circle">
                        {this._generateOpen()}
                    </div>
                </div>
                <hr className="hseparator"/>
                <hr className="vseparator"/>
                {this._generateCard(1)}
            </div>
            <div className={this.props.act!="distribution" ? "deck-place" : "deck-place active"}>
                {this._generateDeck()}
            </div>
        </>
        ) 
    }
}