import React from "react"
import ReactDOM, { flushSync } from "react-dom"
import Board from "./Board.js"
import "../styles/style.css"
import Elfern from "../../Algo/Elfern.js"
import CardDeck from "../../Algo/CardDeck.js"
import Bot from "../../Bot.js"
const d = React.createElement
class ElfernC extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            elfern:new Elfern(10),
            situation: {
                gamer: [],
                opponent: [],
                deck: new CardDeck().getDeck,
            },
            action:"",
            pick: -1,
            hand:0,
            open: []
        }
        
    }

    _distrGamer(newSit,index,limit,i) {
        return new Promise((res) => {
            let count = index
                    let anim1 = setInterval(() => {
                        this.setState({pick:count+i,hand:0})
                        let curr = [...this.state.situation.gamer]
                        setTimeout((coun)=>{
                            curr.push(newSit.gamer[coun])
                            this.setState(
                                {situation:
                                    {...this.state.situation,
                                    gamer:curr}
                                }
                            )
                        },
                        800,count)
                        count++
                        if(count==limit) {
                            clearInterval(anim1) 
                            setTimeout(()=>res(),100)
                        }
                    },1000)
            })           
    }
    
    _distrOpponent(newSit,index,limit,i) {
        return new Promise(res => {
            let count = index
            let anim2 = setInterval(() => {
                this.setState({pick:count+i,
                hand:1})
                let curr = [...this.state.situation.opponent]
                setTimeout((count)=>{
                    curr.push(newSit.opponent[count])
                    this.setState(
                        {situation:
                            {...this.state.situation,
                            opponent:curr}
                        }
                    )
                },
                800, count)
                count++
                if(count==limit) {
                    clearInterval(anim2)
                    setTimeout(()=>res(),100)
                }
            },1000)
        })
    }


    _distribution = (circuit, number, newSit, output = [...newSit])=>  {
        if(this.state.situation.deck.length == 0) {
            return new Promise(res => {
                if(this.state.elfern.over) {
                    this._showWinner()
                }
                res()})
        }
        if(this.state.action=="distribution") {
            return
        }
        this.setState({action:"distribution"})
        
        let count =-number
        let proc = new Promise(res => res())
        for(let i = 0; i < circuit; i++) {
            proc = proc.then(()=>{
                count+=number
                
               if(this.state.elfern.getQueue=="right") {
                    return this._distrOpponent(newSit,count - i*number,count -(i-1) * number, count)
               } else {
                    return this._distrGamer(newSit,count - i*number,count -(i-1) * number, count)
               }  
               
            })
            .then(()=>{
                count+=number
                console.log(count)
                if(this.state.elfern.getQueue=="left") {
                    return this._distrOpponent(newSit,count - (i+1)*number, count- i*number,count)
                } else {
                    return this._distrGamer(newSit,count-(i+1)*number,count-i*number, count)
                }  
            })
        }
        return proc.then(()=> {
            return new Promise(res =>{setTimeout(()=> {
                
                this.setState({situation:{...output}})
                if(this.state.elfern.getQueue =="left" && !this.state.elfern.over){
                    this.setState({pick:-1,action:"Right step"}) 
                    this._enemyStep()
                } else if (this.state.elfern.getQueue =="right" && !this.state.elfern.over){
                    this.setState({action:"Left step",
                    pick:-1}) 
                } else if (this.state.elfern.over) {
                    this._showWinner()
                }
                res()
            },800)})
        })
    }
    _enemyStep = () => {
        this._step(1,new Bot(this.state.elfern,this.state.situation.opponent,this.state.situation.deck).makeStep())
    }

    _step(hand, index) {
        
        if((this.state.action!="Right step" && this.state.elfern.getQueue=="left") || (this.state.action!="Left step" && this.state.elfern.getQueue=="right")) {
            return new Promise(res => res())
        }
        
        let newSit = null
        if(hand==0) {
            newSit = this.state.elfern.gamerStep(index,[...this.state.situation.gamer],[...this.state.situation.opponent],[...this.state.situation.deck])
        } else {
            newSit = this.state.elfern.opponentStep(index,[...this.state.situation.opponent], [...this.state.situation.gamer],[...this.state.situation.deck])
        }
        
    
        this.setState({action:"Pick",
                            pick:index,
                            hand:hand,
                        })
        if(this.state.elfern.currCard!=null) {
            return new Promise(res => {setTimeout(() => {
                this.setState({open:[this.state.elfern.currCard],
                    situation:{...newSit},
                })
                this._showWinner()
                res()
            },800)})
        } else {
            return new Promise(res => {setTimeout(() => {
                if(hand == 0){
                    this.setState({open:[this.state.open[0],this.state.situation.gamer[index]]})
                } else {
                    this.setState({open:[this.state.open[0],this.state.situation.opponent[index]]})
                }
                res()
            },800)})
            .then(() => {
                return new Promise(res =>{setTimeout(()=> {
                    let direction = -1
                    let newGamer = [...this.state.situation.gamer]
                    let newOpponent = [...this.state.situation.opponent]
                    if(hand == 0) {
                        newGamer.splice(index,1)
                    } else {
                        newOpponent.splice(index,1)
                    }
                    for(let card of newSit.gamer) {
                        if(card.rank == this.state.open[0].rank && card.suit == this.state.open[0].suit) {
                            direction = 0
                            newGamer.push(...this.state.open)
                            break
                        }
                    }
                    if(direction == -1) {
                        newOpponent.push(...this.state.open)
                        direction = 1
                    }
                
                    this.setState({situation:{...this.state.situation,gamer:newGamer,opponent:newOpponent},action:"giving",
                    hand:direction})
                    
                    res()
                }),500
            })
            }).then (()=>{
                return new Promise(res =>{setTimeout(()=>{
                    this.setState({open:[],pick:-1})
                    if(this.state.elfern.getQueue=="right") {
                        this.setState({action:"Left step"})
                    } else {
                        this.setState({action:"Right step"})
                    }
                    let pickGamer = null
                    for(let card of newSit.gamer) {
                        let exist = false
                        for(let other of this.state.situation.gamer) {
                            if(card.suit== other.suit && card.rank== other.rank){
                                exist = true
                                break
                            }
                        }
                        if(!exist) {
                            pickGamer = card
                        }
                    }
                    
                    this._distribution(1,1,{gamer:[pickGamer], opponent:newSit.opponent, deck:newSit.deck},newSit).then(()=>{
                        
                        res()
                    })
                },800)})
            })
        }
    }

    _showWinner(){
        if(this.state.elfern.getQueue=="right" && !this.state.elfern.over) {
            this.setState({action:"Left step"})
        } else if(this.state.elfern.getQueue=="left" && !this.state.elfern.over) {
            this.setState({action:"Right step"})
        } else if (this.state.elfern.over) {
            if(this.state.elfern.win == "Right") {
                this.setState({action: "Left won"})
            } else if (this.state.elfern.win == "left") {
                this.setState({action:"Right won"})
            } else {
                this.setState({action:"Draw"})
            }
        }
    }

    _makeStep(index){
        let prev = new Promise(res =>res())
        try{
            prev = this._step(0,index)
        } catch(e) {
            alert(e)
        }
        
        let index2 = new Bot(this.state.elfern,this.state.situation.opponent,this.state.situation.deck).makeStep()
        
        prev.then(()=>{
 
            this._step(1,index2)
        })
   }

   _start(){
    let sit =this.state.elfern.setFirst()
    this._distribution.call(this,2,3,sit,sit)
   }

   

    render() {
        
        return(
            <>
            <div className="controll">
                <button className = {`start ${this.state.action!="" ? "hidden" : ""}`} onClick={this._start.bind(this)}>Start</button>
                <h1 className={`action ${this.state.action!="" ? "" : "hidden"}`}>{this.state.action}</h1>
            </div>
            <Board changer = {this._makeStep.bind(this)} sit = {this.state.situation} act = {this.state.action} pick = {this.state.pick} hand = {this.state.hand} gamerScore = {this.state.elfern.gamerScore} oppScore = {this.state.elfern.opponentScore} open = {this.state.open}></Board>
            
            </>
        ) 
    }
}

ReactDOM.render(d(ElfernC),document.querySelector(".game-elfern"))