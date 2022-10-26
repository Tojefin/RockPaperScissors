import {socket, io} from '../js/controller.js'
import {lobby} from './lobby.js'

function menuElm() {
  let temp = document.createElement('template')
  temp.innerHTML = `
  <section class="menu" id="menu">
    <h1>RPS</h1>
    <div class="block">
      <input class="field" type="password" pattern="[0-9]{6}" id="roomInput" placeholder="Room's ID" required>
      <button class="button" id="join" type="button" name="Join">Join</button>
      <button class="button button--yellow" id="create" type="button" name="Create">Create room</button>
    </div>
  </section>
  `

  temp.content.querySelector('#join').addEventListener("click", () => {join()})
  temp.content.querySelector('#roomInput').addEventListener("keydown", () => {
    if (event.key === 'Enter') {join()}
  })
  temp.content.querySelector('#create').addEventListener("click", () => {lobby.create()})

  return temp.content
}

function join() {
  let roomInput = document.querySelector("#roomInput")
  if (!roomInput.checkValidity()) {return}
  let id = roomInput.value
  lobby.join(id)
}

const menu = {
  render: function() {
    document.body.innerHTML = ''
    document.body.appendChild(menuElm())
  }
}

export {menuElm, menu}
