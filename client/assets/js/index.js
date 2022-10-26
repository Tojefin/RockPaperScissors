import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import {menuElm} from '../elements/menu.js'
document.body.appendChild(menuElm())

var vars = {
  room: 100000,
  ready: false,
  sign: "",
  result: ""
}

export {vars, io}
