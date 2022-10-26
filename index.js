const express = require('express');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

app.use('/', express.static('client'))
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const clientHandler = require('./server/clientHandler');
const lobbyHandler = require('./server/lobbyHandler');
const gameHandler = require('./server/gameHandler');

io.on("connection", (socket) => {
  clientHandler(io, socket);

  lobbyHandler(io, socket);
  gameHandler(io, socket);
});

httpServer.listen(80);
