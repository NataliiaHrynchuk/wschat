const http = require('http');
const express = require('express');
const app = express();
const { Server } = require('socket.io');

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', (ws) => {
  console.log('new client connected');

  ws.emit('chatMessage', 'Welcome to chat'); //відправляю повідомлення новому учаснику
  ws.broadcast.emit('chatMessage', 'new user connected'); //відправляю повідомлення всім іншим учасникам
  ws.on('chatMessage', (message) => {
    ws.broadcast.emit('chatMessage', message); //відправляю отримане від кор-ча повідомлення всім ін учасникам
  });
});

app.get('/', (req, res, next) => {
  return res.sendFile(__dirname + '/index.html');
});

const { PORT = 5000 } = process.env;

httpServer.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('listening on port 5000');
});
