const http = require('http');
const express = require("express");
const cors = require("cors");
const { Server } = require('socket.io');
const slotRouter = require("./routes/slot-routes");

const app = express();
const server = http.createServer(app);
app.options('*', cors());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
// Capture 500 errors
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error!');
  console.warn(`${err.status || 500} - ${res.statusMessage} - ${err.slot} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token');
  next();
});
app.use('/api', slotRouter);

module.exports = { server, io, app };