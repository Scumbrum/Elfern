import Bot from "./Bot.js";
import Elfern from "./Elfern.js";
let elf = new Elfern(10)
let situation = elf.setFirst()
const gamer = situation.gamer
const opponent = situation.opponent
opponent.push(...situation.deck)
const deck = situation.deck


let bot = new Bot(elf,opponent,[])
//console.log(elf.currCard, opponent)
console.log(bot.makeStep())
