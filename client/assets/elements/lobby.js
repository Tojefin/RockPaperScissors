import {socket, io} from '../js/controller.js'
import {vars} from '../js/index.js'
import {menu} from './menu.js'
import {game} from './game.js'

function lobbyElm() {
  let temp = document.createElement('template')
  temp.innerHTML = `
  <section class="lobby" id="lobby">
    <div class="block block--column">
      <p class="list-title">Players</p>
      <ul class="list" id="playerList">
      </ul>
      <span id="roomView"></span>
    </div>
    <div class="block">
      <button class="button button--lime" type="button" id="ready" name="Ready">Ready</button>
      <button class="button button--red" type="button" id="leave" name="Leave">Leave room</button>
    </div>
  </section>
  `

  temp.content.querySelector('#ready').addEventListener("click", (e) => {
    let button = e.target
    if (vars.ready) {
      button.style.background = ""
      button.innerText = "Ready"
    } else {
      button.style.background = "grey"
      button.innerText = "Cancel"
    }
    lobby.ready()
  })

  temp.content.querySelector('#leave').addEventListener("click", () => {lobby.leave()})

  return temp.content
}

const lobby = {
  render: function() {
    document.body.innerHTML = ''
    document.body.appendChild(lobbyElm())
    vars.ready = false;
    document.querySelector("#roomView").innerText = vars.room
  },

  join: function(id) {
    socket.emit("lobby:join", id)
  },

  create: function() {
    socket.emit("lobby:create")
  },

  leave: function() {
    menu.render()
    socket.emit("lobby:leave")
  },

  ready: function() {
    vars.ready = !vars.ready
    socket.emit("lobby:ready", vars.ready)
  },

  updatePlayerList: function (players) {
    let pl = document.querySelector("#playerList");
    pl.innerHTML = '';
    players.forEach((player) => {
      let li = document.createElement('li')
      li.id = player.id
      li.innerText = player.id
      if (player.ready) {
        li.style.color = "lime";
      } else {
        li.style.color = "gray";
      }
      pl.append(li)
    });
  }
};

export {lobbyElm, lobby}
