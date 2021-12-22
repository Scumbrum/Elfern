import CardImage from "../../Algo/CardImage.js";
import React from "react"
export default class Open extends React.Component {
    constructor(props) {
        super(props)   
    }

    _generate() {
        let images = []
        for(let card of this.props.cards) {
            if(!card) {
                images.push(CardImage.get("NN"))
                continue
            }
            images.push(CardImage.get(card.rank+card.suit))
        }
        
        images = images.map((element)=>{
            let component = <li><img src = {`D:/Algorithm/lab6/media/${element}`}/></li>
            return component
        })
        return images
    }

    render() {
        return(
            <ul className={this.props.hand != undefined ? `give${this.props.hand}` : ""}>
                {this._generate()}
            </ul>
        ) 
    }
}