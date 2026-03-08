
require('dotenv').config();

const http = require("http");
const app = require("./app");

const { Server } = require("socket.io");
const socketHandler = require('./socket/socket');

const port = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

socketHandler(io);

app.set("io", io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});