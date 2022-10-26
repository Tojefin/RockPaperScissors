const {rooms, users} = require('./vars');

module.exports = (io, socket) => {

  const gameExit = () => {
    let id = users.find(o => o.id == socket.id).room
    let room = rooms.find(o => o.id == id);
    let player = room.players.find(o => o.id == socket.id)

    room.status = "wait players"
    room.players.forEach((player, i) => {
      delete room.players[i].sign
    })

    io.to("Room:"+id).emit("lobby:update", "status", {status: "wait players"})
    io.to("Room:"+id).emit("lobby:update", "playerList", room.players)
  }

  const gameConfirm = (sign) => {
    let id = users.find(o => o.id == socket.id).room
    let room = rooms.find(o => o.id == id);
    let player = room.players.find(o => o.id == socket.id)

    let i = room.players.indexOf(player)
    room.players[i].sign = sign

    socket.emit("game:update", "status", {status: "wait"})

    let players = room.players.filter(o => o.sign !== undefined)
    if (players.length == 2) {

      if (players[0].sign == players[1].sign) {
        io.to("Room:"+id).emit("game:update", "status", {
          status: "end",
          result: "Draw",
          signs: [players[0].sign, players[1].sign]
        })
        return
      }

      let win = ["💎:✂", "✂:📃", "📃:💎"]
      let comb = players[0].sign+":"+players[1].sign

      players[0].result = "Defeat"
      players[1].result = "Win"
      if (win.includes(comb)) {
        players[0].result = "Win"
        players[1].result = "Defeat"
      }
			
      io.to(players[0].id).emit("game:update", "status", {
        status: "end",
        result: players[0].result,
        signs: [players[0].sign, players[1].sign]
      })
      io.to(players[1].id).emit("game:update", "status", {
        status: "end",
        result: players[1].result,
        signs: [players[0].sign, players[1].sign]
      })

    }
  }

  socket.on("game:exit", gameExit);
  socket.on("game:confirm", gameConfirm);
};
