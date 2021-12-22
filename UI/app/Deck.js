import React from "react"
import CardImage from "../../Algo/CardImage.js"
export default class Deck extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        
    }

    _getImage() {
        let images = []
        for (let i = 0; i < this.props.cards;i++) {
            if(i < this.props.pick) {
                images.push(<li className="hide"><img src = {`D:/Algorithm/lab6/media/${CardImage.get("NN")}`}/></li>)
            } else {
                images.push(<li className={this.props.pick == i ? `move${this.props.hand}` : ""}><img src = {`D:/Algorithm/lab6/media/${CardImage.get("NN")}`}/></li>)
   
            }
        }
        this.state.images = images
        return images
    }

    render() {
        return(
            <div>
                <ul className="deck">{this._getImage()}</ul>
                <h1>{this.props.cards}</h1>
            </div>
        ) 
    }
}