import {socket, io} from '../js/controller.js'
import {vars} from '../js/index.js'
import {lobby} from './lobby.js'

function gameElm() {
  let temp = document.createElement('template')
  temp.innerHTML = `
  <section class="game" id="game">
    <div class="block block--column" id="result">
    </div>
    <div class="block">
      <ul class="list list--row" id="nav">
        <li><button class="button" type="button" data-sign="💎" id="sign" name="Rock">Rock</button></li>
        <li><button class="button" type="button" data-sign="📃" id="sign" name="Paper">Paper</button></li>
        <li><button class="button" type="button" data-sign="✂" id="sign" name="Scissors">Scissors</button></li>
        <br>
        <button class="button button--gray" type="button" id="confirm" name="Confirm" disabled>Confirm</button>
      </ul>
      <button class="button button--red" type="button" id="exit" name="Exit">Exit</button>
    </div>
  </section>
  `

  temp.content.querySelectorAll('#sign').forEach((sign) => {
    sign.addEventListener("click", () => {choseSign(sign.dataset.sign)})
  });

  temp.content.querySelector('#confirm').addEventListener("click", (e) => {game.confirm(vars.sign)})

  temp.content.querySelector('#exit').addEventListener("click", () => {game.exit()})

  return temp.content
}

function choseSign(sign) {
  vars.sign = sign;
  document.querySelectorAll('#sign').forEach((item) => {
    item.classList.remove("button--gray")
  })
  document.querySelector('#sign[data-sign="'+sign+'"]').classList.toggle("button--gray")
  document.querySelector('#confirm').classList.add("button--lime")
  document.querySelector('#confirm').disabled = false
}

const game = {
  render: function() {
    document.body.innerHTML = ''
    document.body.appendChild(gameElm())
    document.querySelector("#result").innerHTML = `<h2>Chose your sign</h2>`
  },

  exit: function() {
    lobby.render()
    socket.emit("game:exit")
  },

  confirm: function(sign) {
    console.log(sign);
    socket.emit("game:confirm", sign)
  },

  update: function (status, result, signs) {
    if (status == "wait") {
      document.querySelector('#nav').remove()
      return document.querySelector('#result').innerHTML = `<h2>Wait opponent...</h2>`;
    }
    if (status == "end") {
      return document.querySelector('#result').innerHTML = `<h2>${result}</h2><h2>${signs[0]} ~ ${signs[1]}</h2>`
    }
  }
}

export {gameElm, game}
