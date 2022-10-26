import {game} from '../elements/game.js'
import {lobby} from '../elements/lobby.js'
import {vars, io} from './index.js'
const socket = io();

socket.on("disconnect", () => {location.reload()})

socket.on("error", (item, type, desc) => {
  if (item == "room") {
    alert(desc)
  }
})

socket.on("lobby:joined", (room) => {
  vars.room = room
  lobby.render()
})

socket.on("lobby:created", (room) => {
  document.querySelector("#roomInput").value = room
  lobby.join(room)
})

socket.on("lobby:update", (item, data) => {
  if (item == "playerList") {
    return lobby.updatePlayerList(data)
  }

  if (item == "status") {
    if (data.status == "in game") {
      game.render()
    }
    if (data.status == "wait players") {
      lobby.render()
    }
  }
})

socket.on("game:update", (item, data) => {
  game.update(data.status, data.result, data.signs)
})

export {socket, io}
