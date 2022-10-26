const {rooms, users} = require('./vars');

module.exports = (io, socket) => {

  users.push({id: socket.id})
  console.log("User "+socket.id+" connect");

  const clientDisconnect = () => {
    console.log("User "+socket.id+" disconnect");

    let user = users.find(o => o.id == socket.id)
    if (user.room) {
      let id = user.room
      let room = rooms.find(o => o.id == id);
      let player = room.players.find(o => o.id == socket.id);

      room.status = "wait players"
      room.players.forEach((player, i) => {
        delete room.players[i].sign
      })

      let i = room.players.indexOf(player)
      room.players.splice(i, 1);

      if (room.players.length == 0) {
        console.log("Lobby "+id+" removed")
        rooms.splice(rooms.indexOf(room), 1)
        return
      }

      io.to("Room:"+id).emit("lobby:update", "status", {status: "wait players"})
      io.to("Room:"+id).emit("lobby:update", "playerList", room.players)
    }
    users.splice(users.indexOf(user), 1)
  }

  socket.on("disconnecting", clientDisconnect);
};
