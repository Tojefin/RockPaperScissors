const {rooms, users} = require('./vars');

module.exports = (io, socket) => {

  const lobbyCreate = () => {
    let id = Math.floor(100000 + Math.random() * 900000)
    while (rooms[id]) {
      id = Math.floor(100000 + Math.random() * 900000)
    }

    rooms.push({id: id, creator: socket.id, status: "wait players", players: []})
    socket.emit("lobby:created", id)

    console.log("Lobby "+id+" created")
  }

  const lobbyJoin = (id) => {
    let room = rooms.find(o => o.id == id);
    let player = users.find(o => o.id == socket.id)

    if (!room) {
      return socket.emit("error", "room", "undefined", "Room undefined")
    }
    if (room.players.length == 2) {
      return socket.emit("error", "room", "max players", "Room rich max players")
    }

    room.players.push({id: socket.id, ready: false})
    users[users.indexOf(player)].room = id

    socket.join("Room:"+id);
    socket.emit("lobby:joined", id)
    io.to("Room:"+id).emit("lobby:update", "playerList", room.players)

    console.log("User "+socket.id+" join to "+id)
  }

  const lobbyLeave = () => {
    let user = users.find(o => o.id == socket.id)
    let id = user.room;
    let room = rooms.find(o => o.id == id);
    let player = room.players.find(o => o.id == socket.id);

    users[users.indexOf(user)].room = undefined
    let i = room.players.indexOf(player)
    room.players.splice(i, 1);

    console.log("User "+socket.id+" leave from "+id)
    
    if (room.players.length == 0) {
      console.log("Lobby "+id+" removed")
      rooms.splice(rooms.indexOf(room), 1)
      return
    }

    io.to("Room:"+id).emit("lobby:update", "playerList", room.players)
  }

  const lobbyReady = (state) => {
    let id = users.find(o => o.id == socket.id).room;
    let room = rooms.find(o => o.id == id);
    let player = room.players.find(o => o.id == socket.id);

    let i = room.players.indexOf(player)
    room.players[i].ready = state

    if (room.players.filter(o => o.ready == true).length == 2) {
      room.status = "in game"
      room.players.forEach((player, i) => {
        room.players[i].ready = false
      })

      console.log("Lobby "+id+" in game")
      return io.to("Room:"+id).emit("lobby:update", "status", {status: "in game"})
    }

    io.to("Room:"+id).emit("lobby:update", "playerList", room.players)
  }

  socket.on("lobby:create", lobbyCreate);
  socket.on("lobby:join", lobbyJoin);
  socket.on("lobby:leave", lobbyLeave);
  socket.on("lobby:ready", lobbyReady);
};
