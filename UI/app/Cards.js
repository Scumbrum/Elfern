import React from "react"

import CardImage from "../../CardImage.js";
export default class Cards extends React.Component {
    constructor(props) {
        super(props)  
    }

    _gerateCards() {
        let images = []
        for(let card of this.props.cards) {
            if(!card) {
                images.push(CardImage.get("NN"))
                continue
            }
            images.push(CardImage.get(card.rank+card.suit))
        }
        for(let i = 0 ; i< images.length; i++){
            
                let put = null
                
                if(i ==this.props.pick) {
                    
                    put = "put"
                }
                let onClick = undefined
                if(this.props.changer!=null){
                    onClick = () => {
                        this.props.changer(i)
                    }
                    images[i]= <li className={put} onClick={onClick}><img src = {`D:/Algorithm/lab6/media/${images[i]}`}/></li>

                }else {
                    images[i]= <li className={put}><img src = {`D:/Algorithm/lab6/media/${images[i]}`}/></li>

                }
                
        }
        return images
    }

    render() {
        return(
            <div className = {"hand " + this.props.className}>
                <ul className="cards">{this._gerateCards()}</ul>
                <h1>{this.props.score}</h1>
            </div>
            
        ) 
    }
}